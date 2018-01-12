function output  = StreamData
        url = 'http://10.0.0.53:3000/api/streamdata';
        options = weboptions('Timeout',30);
        dataGet = webread(url,options);
        disp('get data')
        data = dataGet;
           
        temperature = data.temperature;
        accelerometer = data.accelerometer;
        din1 = data.din1;
        
        

    temperature = struct2table(temperature);
    accelerometer = struct2table(accelerometer);
    din1 = struct2table(din1);
    
    dataLength1 = min(height(temperature),height(accelerometer))
    dataLength = min(dataLength1,height(din1));
    
    
    temperature.date = strrep(temperature.date, 'T', ' ');
    temperature.date = strrep(temperature.date, '.000Z', '');
    temperature.date = datetime(temperature.date);
    temperature.val = str2double(temperature.val);
    temperature = sortrows(temperature,'date');
    
    accelerometer.date = strrep(accelerometer.date, 'T', ' ');
    accelerometer.date = strrep(accelerometer.date, '.000Z', '');
    accelerometer.date = datetime(accelerometer.date);
    accelerometer.val_x = str2double(accelerometer.val_x);
    accelerometer.val_x = 20 + (20*accelerometer.val_x);
    accelerometer.val_y = str2double(accelerometer.val_y);
    accelerometer.val_y = 20 + (20*accelerometer.val_y);
    accelerometer.val_z = str2double(accelerometer.val_z);
    accelerometer.val_z = 20 + (20*accelerometer.val_z);
    accelerometer = sortrows(accelerometer,'date');

    din1.date = strrep(din1.date,'T',' ');
    din1.date = strrep(din1.date, '.000Z','');
    din1.date = datetime(din1.date);
    din1.val = str2double(din1.val);
    din1 = sortrows(din1,'date');
    
    from = (height(temperature))- dataLength+1;
    to = height(temperature)-1;
    
    output = struct('temperature',temperature,'accelerometer',accelerometer,'din1',din1);

    
    
    
end