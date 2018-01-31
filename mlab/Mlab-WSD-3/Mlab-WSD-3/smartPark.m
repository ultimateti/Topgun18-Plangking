function varargout = smartPark(varargin)
% SMARTPARK MATLAB code for smartPark.fig
%      SMARTPARK, by itself, creates a new SMARTPARK or raises the existing
%      singleton*.
%
%      H = SMARTPARK returns the handle to a new SMARTPARK or the handle to
%      the existing singleton*.
%
%      SMARTPARK('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in SMARTPARK.M with the given input arguments.
%
%      SMARTPARK('Property','Value',...) creates a new SMARTPARK or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before smartPark_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to smartPark_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help smartPark

% Last Modified by GUIDE v2.5 31-Jan-2018 10:48:42

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @smartPark_OpeningFcn, ...
                   'gui_OutputFcn',  @smartPark_OutputFcn, ...
                   'gui_LayoutFcn',  [] , ...
                   'gui_Callback',   []);
if nargin && ischar(varargin{1})
    gui_State.gui_Callback = str2func(varargin{1});
end

if nargout
    [varargout{1:nargout}] = gui_mainfcn(gui_State, varargin{:});
else
    gui_mainfcn(gui_State, varargin{:});
end
% End initialization code - DO NOT EDIT


% --- Executes just before smartPark is made visible.
function smartPark_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to smartPark (see VARARGIN)

% Get Sensor from Server
handles.data.temp = GetData('temperature');
handles.data.gyro = GetData('gyroscope');

% Create Timer
handles.speed = 2;
handles.output = hObject;
handles.stateButton = 0;
T = timer; % make timer
T.period = 0.002; % period = 0.1
T.ExecutionMode = 'fixedRate';
T.TimerFcn = @Update_Fcn; % this function executed
handles.timer = T; % make then to handle


% Choose default command line output for smartPark
handles.output = hObject;


% Update handles structure
guidata(hObject, handles);

% UIWAIT makes smartPark wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = smartPark_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in detectButton.
function detectButton_Callback(hObject, eventdata, handles)
% hObject    handle to detectButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes on button press in trainButton.
function trainButton_Callback(hObject, eventdata, handles)
% hObject    handle to trainButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes on button press in labelButton.
function labelButton_Callback(hObject, eventdata, handles)
% hObject    handle to labelButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
c = struct();
c.idx = 1;
c.xData = handles.data.temp.date;
c.yData = handles.data.temp.val;
an = animatedline(handles.temperatureGraph); % make animatedine
datetick(handles.temperatureGraph,'x','keepticks','keeplimits');
c.handle = an;
handles.timer.UserData = c;
start(handles.timer);

% --- Local Function
function Update_Fcn(obj, evt)
c = obj.UserData;
if c.idx <= size(c.xData,1)
    for i = 1:3
        x = datenum(c.xData(c.idx));
        y = c.yData(c.idx);
        addpoints(c.handle, x, y);
        c.idx = c.idx + 1;
    end
    obj.UserData = c;
    drawnow
else
    stop(obj);
end
