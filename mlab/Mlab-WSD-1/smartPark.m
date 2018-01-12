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

% Last Modified by GUIDE v2.5 12-Jan-2018 02:33:06

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

% Timer
T = timer; % make timer
T.period = 0.001; % period = 0.1
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
str = 'well';
options = weboptions('timeout',20);
response = webwrite('http://10.0.0.53:3000/alert','teamID',24,'description', str, options);
disp(det);

% --- Executes on button press in trainButton.
function trainButton_Callback(hObject, eventdata, handles)
% hObject    handle to trainButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

inputSet = load('input.mat');
inputSet = inputSet.inputSet;
targetSet = load('target.mat');
targetSet = targetSet.targetSet;
net.divideParam.trainRatio = 70/100;
net.divideParam.valRatio = 15/100;
net.divideParam.testRatio = 15/100;
net = patternnet(10);
[net,~] = train(net, inputSet, targetSet);

output = net(inputSet);

outputMax = zeros(4,113);
outputMax(1,:) = max(output);
outputMax(2,:) = max(output);
outputMax(3,:) = max(output);
outputMax(4,:) = max(output);

cond = (output == outputMax);
final = vec2ind(cond);

handles.normTrainText.String = num2str( length(inputSet(final == 1)) );
handles.fireTrainText.String = num2str( length(inputSet(final == 4)) );
handles.treeTrainText.String = num2str( length(inputSet(final == 2)) );
handles.elephantTrainText.String = num2str( length(inputSet(final == 3)) );


% --- Executes on button press in labelButton.
function labelButton_Callback(hObject, eventdata, handles)
% hObject    handle to labelButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
disp('label');
output = GetData('off');
handles.tem = output.temperature;
handles.acc = output.accelerometer;
handles.din = output.din1;

handles.x = datenum(handles.tem.date);
handles.y = handles.tem.val;
datetick(handles.Graph, 'x');

c.idx = 1;
c.xData = handles.x;
c.yData = handles.y;
an = animatedline; % make animatedine
c.handle = an;
handles.timer.UserData = c;
start(handles.timer);

    
function Update_Fcn(obj, evt)
c = obj.UserData;
if c.idx <= size(c.xData,1)
    x = datenum(c.xData(c.idx));
    y = c.yData(c.idx);
    addpoints(c.handle, x, y);
    if(c.idc <= 5)
        c.idc = c.idc + 1;
    else
        c.idx = c.idx + 1;
        c.idc = 1;
    end
    obj.UserData = c;
    drawnow
else
    stop(obj);
end

        



function edit1_Callback(hObject, eventdata, handles)
% hObject    handle to edit1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of edit1 as text
%        str2double(get(hObject,'String')) returns contents of edit1 as a double


% --- Executes during object creation, after setting all properties.
function edit1_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on button press in stopButton.
function stopButton_Callback(hObject, eventdata, handles)
% hObject    handle to stopButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
stop(handles.T);
