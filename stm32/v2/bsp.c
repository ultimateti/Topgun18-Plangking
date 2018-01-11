 /******************************************************************************
  * @file    bsp.c
  * @author  MCD Application Team
  * @version V1.1.0
  * @date    27-February-2017
  * @brief   manages the sensors on the application
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2017 STMicroelectronics International N.V. 
  * All rights reserved.</center></h2>
  *
  * Redistribution and use in source and binary forms, with or without 
  * modification, are permitted, provided that the following conditions are met:
  *
  * 1. Redistribution of source code must retain the above copyright notice, 
  *    this list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the documentation
  *    and/or other materials provided with the distribution.
  * 3. Neither the name of STMicroelectronics nor the names of other 
  *    contributors to this software may be used to endorse or promote products 
  *    derived from this software without specific written permission.
  * 4. This software, including modifications and/or derivative works of this 
  *    software, must execute solely and exclusively on microcontroller or
  *    microprocessor devices manufactured by or for STMicroelectronics.
  * 5. Redistribution and use of this software other than as permitted under 
  *    this license is void and will automatically terminate your rights under 
  *    this license. 
  *
  * THIS SOFTWARE IS PROVIDED BY STMICROELECTRONICS AND CONTRIBUTORS "AS IS" 
  * AND ANY EXPRESS, IMPLIED OR STATUTORY WARRANTIES, INCLUDING, BUT NOT 
  * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
  * PARTICULAR PURPOSE AND NON-INFRINGEMENT OF THIRD PARTY INTELLECTUAL PROPERTY
  * RIGHTS ARE DISCLAIMED TO THE FULLEST EXTENT PERMITTED BY LAW. IN NO EVENT 
  * SHALL STMICROELECTRONICS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
  * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
  * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
  * OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
  * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING 
  * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
  * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *
  ******************************************************************************
  */
  
  /* Includes ------------------------------------------------------------------*/
#include <string.h>
#include <stdlib.h>
#include "hw.h"
#include "timeServer.h"
#include "bsp.h"
#if defined(LRWAN_NS1)
#include "lrwan_ns1_humidity.h"
#include "lrwan_ns1_pressure.h"
#include "lrwan_ns1_temperature.h"
#else
#if defined(SENSOR_ENABLED)
//#include "x_nucleo_iks01a1_humidity.h"
//#include "x_nucleo_iks01a1_pressure.h"
//#include "x_nucleo_iks01a1_temperature.h"

#include "x_nucleo_iks01a2_humidity.h"
#include "x_nucleo_iks01a2_pressure.h"
#include "x_nucleo_iks01a2_temperature.h"

#include "x_nucleo_iks01a2_accelero.h"
#include "x_nucleo_iks01a2_gyro.h"
#include "x_nucleo_iks01a2_magneto.h"

#endif
#endif



/* Private typedef -----------------------------------------------------------*/
/* Private define ------------------------------------------------------------*/
#define STSOP_LATTITUDE ((float) 43.618622 )
#define STSOP_LONGITUDE ((float) 7.051415  )
#define MAX_GPS_POS ((int32_t) 8388607  ) // 2^23 - 1
/* Private macro -------------------------------------------------------------*/
/* Private variables ---------------------------------------------------------*/
/* Private function prototypes -----------------------------------------------*/
/* Exported functions ---------------------------------------------------------*/

/* Private variables ---------------------------------------------------------*/
#if defined(SENSOR_ENABLED) || defined (LRWAN_NS1)
void *HUMIDITY_handle = NULL;
void *TEMPERATURE_handle = NULL;
void *PRESSURE_handle = NULL;

void *ACCELERO_handle;
void *GYRO_handle;
void *MAGNETO_handle;

SensorAxes_t ACC_Value;                  /*!< Acceleration Value */
SensorAxes_t GYR_Value;                  /*!< Gyroscope Value */
SensorAxes_t MAG_Value;                  /*!< Magnetometer Value */

__IO uint8_t SENSOR_DETECTED;
uint8_t Wake_Up_Active;
uint8_t time;
#endif

void BSP_sensor_Read( sensor_t *sensor_data)
{
  /* USER CODE BEGIN 5 */
  float HUMIDITY_Value = 0;
  float TEMPERATURE_Value = 0;
  float PRESSURE_Value = 0;

#if defined(SENSOR_ENABLED) || defined (LRWAN_NS1)
  BSP_HUMIDITY_Get_Hum(HUMIDITY_handle, &HUMIDITY_Value);
  BSP_TEMPERATURE_Get_Temp(TEMPERATURE_handle, &TEMPERATURE_Value);
  BSP_PRESSURE_Get_Press(PRESSURE_handle, &PRESSURE_Value);
	
	BSP_GYRO_Get_Axes(GYRO_handle, &GYR_Value);
	BSP_MAGNETO_Get_Axes(MAGNETO_handle, &MAG_Value);
	BSP_ACCELERO_Get_Axes(ACCELERO_handle, &ACC_Value);
	

	
#endif  
  sensor_data->humidity    = HUMIDITY_Value;
  sensor_data->temperature = TEMPERATURE_Value;
  sensor_data->pressure    = PRESSURE_Value;
  
  sensor_data->latitude  = (int32_t) ((STSOP_LATTITUDE  * MAX_GPS_POS) /90);
  sensor_data->longitude = (int32_t) ((STSOP_LONGITUDE  * MAX_GPS_POS )/180);
  /* USER CODE END 5 */
}

void  BSP_sensor_Init( void  )
{
  /* USER CODE BEGIN 6 */

#if defined(SENSOR_ENABLED) || defined (LRWAN_NS1)
  /* Initialize sensors */
  BSP_HUMIDITY_Init( HTS221_H_0, &HUMIDITY_handle );
  BSP_TEMPERATURE_Init( HTS221_T_0, &TEMPERATURE_handle );
  BSP_PRESSURE_Init( PRESSURE_SENSORS_AUTO, &PRESSURE_handle );
	
	
	/* Try to use automatic discovery. By default use LSM6DSL on board */
  BSP_ACCELERO_Init( ACCELERO_SENSORS_AUTO, &ACCELERO_handle );
  /* Try to use automatic discovery. By default use LSM6DSL on board */
  BSP_GYRO_Init( GYRO_SENSORS_AUTO, &GYRO_handle );
  /* Try to use automatic discovery. By default use LSM303AGR on board */
  BSP_MAGNETO_Init( MAGNETO_SENSORS_AUTO, &MAGNETO_handle );
  /* Try to use automatic discovery. By default use HTS221 on board */
  
  /* Enable sensors */
  BSP_HUMIDITY_Sensor_Enable( HUMIDITY_handle );
  BSP_TEMPERATURE_Sensor_Enable( TEMPERATURE_handle );
  BSP_PRESSURE_Sensor_Enable( PRESSURE_handle );
	
	BSP_ACCELERO_Sensor_Enable( ACCELERO_handle );
  BSP_GYRO_Sensor_Enable( GYRO_handle );
  BSP_MAGNETO_Sensor_Enable( MAGNETO_handle );
	
	BSP_ACCELERO_Enable_Single_Tap_Detection_Ext(ACCELERO_handle);		// Tap enable Modify 4/1/2018
	BSP_ACCELERO_Set_Tap_Threshold_Ext(ACCELERO_handle, 3);						// Tap TSH Modify 4/1/2018 //5 bit
	//BSP_ACCELERO_Set_Interrupt_Latch_Ext(ACCELERO_handle,ENABLE);			// Tap Interrupt enable 4/1/2018
	//BSP_ACCELERO_Set_Tap_Duration_Time_Ext(ACCELERO_handle, (uint8_t) 0x1B);
	
#endif
    /* USER CODE END 6 */
}

void Check_Sensor_Detect(void)  // Read Status and latch Modify 4/1/2018
{
	if(SENSOR_DETECTED==0){
		BSP_ACCELERO_Get_Single_Tap_Detection_Status_Ext(ACCELERO_handle,&Wake_Up_Active);
		SENSOR_DETECTED = Wake_Up_Active;
	}
}



/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/
