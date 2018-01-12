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

% Last Modified by GUIDE v2.5 12-Jan-2018 02:34:44

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



% Choose default command line output for Timer
handles.output = hObject;
handles.stateButton = 0;
T = timer; % make timer
T.period = 0.01; % period = 0.1
T.ExecutionMode = 'fixedRate';
T.TimerFcn = @Update_Fcn; % this function executed
handles.timer = T; % make then to handle


% Graph

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
guidata(hObject, handles);


% --- Executes on button press in detectButton.
function detectButton_Callback(hObject, eventdata, handles)
% hObject    handle to detectButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
output = StreamData();
handles.tem = output.temperature;
handles.acc = output.accelerometer;
handles.din = output.din1;
disp('stream compete');

c = struct();
c.detectState = 1;
c.idx = 1;

c.xData_tem = datenum(handles.tem.date);
c.yData_tem = handles.tem.val;

c.xData_accx = datenum(handles.acc.date);
c.yData_accx = handles.acc.val_x;

c.xData_accy = datenum(handles.acc.date);
c.yData_accy = handles.acc.val_y;

c.xData_accz = datenum(handles.acc.date);
c.yData_accz = handles.acc.val_z;

c.xData_din = datenum(handles.din.date);
c.yData_din = handles.din.val;

an_tem = animatedline('Color','r'); % make animatedine
an_accx = animatedline('Color','g');
an_accy = animatedline('Color','c');
an_accz = animatedline('Color','b');
an_din = animatedline('Color','m');

c.handle_tem = an_tem;
c.handle_accx = an_accx;
c.handle_accy = an_accy;
c.handle_accz = an_accz;
c.handle_din = an_din;

handles.timer.UserData = c;


inputSet = load('input.mat');
inputSet = inputSet.inputSet;
targetSet = load('target.mat');
targetSet = targetSet.targetSet;
net.divideParam.trainRatio = 70/100;
net.divideParam.valRatio = 15/100;
net.divideParam.testRatio = 15/100;
net = patternnet(10);
[net,~] = train(net, inputSet, targetSet);


disp(net);
index_tem = floor(length(handles.tem.val)-1);
index_acc = floor(length(handles.acc.val_x)-1);
index_din = floor(length(handles.din.val)-1);

in1 = handles.tem.val(index_tem);
disp(in1);
in2 = handles.acc.val_x(index_acc);
in3 = handles.acc.val_y(index_acc);
in4 = handles.acc.val_z(index_acc);
in5 = handles.din.val(index_din);

output = net([in1;in2;in3;in4;in5]);
outputMax = max(output);
output = (output == outputMax);
output = output';

disp(output);

if (output(1) == 1) handles.currentText.String = 'Normal';
elseif (output(2) == 1) handles.currentText.String = 'Treefall';
elseif (output(3) == 1) handles.currentText.String = 'Elephant';
elseif (output(4) == 1) handles.currentText.String = 'Fire';
end

webwrite('http://10.0.0.53:3000/alert','teamID',45,'description',handles.currentText.String);
disp('compete');
start(handles.timer);
guidata(hObject, handles);

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

guidata(hObject, handles);
save('net.mat','net');


% --- Executes on button press in labelButton.
function labelButton_Callback(hObject, eventdata, handles)
% hObject    handle to labelButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
disp('to lb 1')
output = GetData();
handles.tem = output.temperature;
handles.acc = output.accelerometer;
handles.din = output.din1; 

c = struct();
c.detectState = 0;
c.idx = 1;

c.xData_tem = datenum(handles.tem.date);
c.yData_tem = handles.tem.val;

c.xData_accx = datenum(handles.acc.date);
c.yData_accx = handles.acc.val_x;

c.xData_accy = datenum(handles.acc.date);
c.yData_accy = handles.acc.val_y;

c.xData_accz = datenum(handles.acc.date);
c.yData_accz = handles.acc.val_z;

c.xData_din = datenum(handles.din.date);
c.yData_din = handles.din.val;

an_tem = animatedline('Color','r'); % make animatedine
an_accx = animatedline('Color','g');
an_accy = animatedline('Color','c');
an_accz = animatedline('Color','b');
an_din = animatedline('Color','m');

c.handle_tem = an_tem;
c.handle_accx = an_accx;
c.handle_accy = an_accy;
c.handle_accz = an_accz;
c.handle_din = an_din;

handles.timer.UserData = c;
disp('to lb 4')
start(handles.timer);

    
function Update_Fcn(obj, evt)
c = obj.UserData;
if (mod(c.idx, 500) == 0 & c.detectState == 1)
   disp(update);
   % output = StreamData(); 
end
if c.idx <= max([size(c.xData_tem,1),size(c.xData_accx,1),size(c.xData_din,1)])
        x = datenum(c.xData_tem(c.idx));
        y = c.yData_tem(c.idx);

        x2 = datenum(c.xData_accx(c.idx));
        y2 = c.yData_accx(c.idx);

        x3 = datenum(c.xData_accy(c.idx));
        y3 = c.yData_accy(c.idx);

        x4 = datenum(c.xData_accz(c.idx));
        y4 = c.yData_accz(c.idx);

        x5 = datenum(c.xData_din(c.idx));
        y5 = c.yData_din(c.idx);

        addpoints(c.handle_tem, x, y);
        addpoints(c.handle_accx, x2, y2);
        addpoints(c.handle_accy, x3, y3);
        addpoints(c.handle_accz, x4, y4);
        addpoints(c.handle_din, x5, y5);
        c.idx = c.idx + 1;
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
stop(handles.timer);
