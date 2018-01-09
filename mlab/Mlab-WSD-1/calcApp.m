function varargout = calcApp(varargin)
% CALCAPP MATLAB code for calcApp.fig
%      CALCAPP, by itself, creates a new CALCAPP or raises the existing
%      singleton*.
%
%      H = CALCAPP returns the handle to a new CALCAPP or the handle to
%      the existing singleton*.
%
%      CALCAPP('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in CALCAPP.M with the given input arguments.
%
%      CALCAPP('Property','Value',...) creates a new CALCAPP or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before calcApp_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to calcApp_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help calcApp

% Last Modified by GUIDE v2.5 09-Jan-2018 15:50:59

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @calcApp_OpeningFcn, ...
                   'gui_OutputFcn',  @calcApp_OutputFcn, ...
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


% --- Executes just before calcApp is made visible.
function calcApp_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to calcApp (see VARARGIN)

% Choose default command line output for calcApp
handles.output = hObject;
handles.stateButton = 0;
T = timer; % make timer
T.period = 0.001; % period = 0.1
T.ExecutionMode = 'fixedRate';
T.TimerFcn = @Update_Fcn; % this function executed
handles.timer = T; % make then to handle


% Update handles structure
guidata(hObject, handles);

% UIWAIT makes calcApp wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = calcApp_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in selectButton.
function selectButton_Callback(hObject, eventdata, handles)
% hObject    handle to selectButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

[filename, pathname] = uigetfile('*.csv');

handles.data = importfile(filename);
handles.y = handles.data.PowerkW;
handles.x = handles.data.Timestamp;



% Update handles structure
guidata(hObject, handles);

% --- Executes on button press in startButton.
function startButton_Callback(hObject, eventdata, handles)
% hObject    handle to startButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.stateButton = 1-handles.stateButton;
if(handles.stateButton == 1)
    c = struct();
    c.idx = 1;
    c.xData = handles.x;
    c.yData = handles.y;
    an = animatedline; % make animatedine
    c.handle = an;
    handles.timer.UserData = c;
    start(handles.timer);
    handles.startButton.String = 'Stop';    
else
    stop(handles.timer);
    handles.startButton.String = 'Start';
end
% Update handles structure
guidata(hObject, handles);

% --- Executes on slider movement.
function slider_Callback(hObject, eventdata, handles)
% hObject    handle to slider (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider



% --- Executes during object creation, after setting all properties.
function slider_CreateFcn(hObject, eventdata, handles)
% hObject    handle to slider (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end



function edit_Callback(hObject, eventdata, handles)
% hObject    handle to edit (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of edit as text
%        str2double(get(hObject,'String')) returns contents of edit as a double

% Update handles structure
w = str2double(get(handles.edit,'string'));
handles.week = w;
guidata(hObject, handles);


% --- Executes during object creation, after setting all properties.
function edit_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on button press in editButton.
function editButton_Callback(hObject, eventdata, handles)
% hObject    handle to editButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
w = handles.week;
cond = (handles.data.Timestamp > datetime('01/01/2010') + days(7*w)) & (handles.data.Timestamp <= datetime('01/01/2010') + days((7*w) + 7));
handles.y = handles.data.PowerkW(cond);
handles.x = handles.data.Timestamp(cond);
plot(handles.x,handles.y);

function Update_Fcn(obj, evt)
c = obj.UserData;
if c.idx <= size(c.xData,1)
        x = datenum(c.xData(c.idx));
        y = c.yData(c.idx);
        addpoints(c.handle, x, y);
        c.idx = c.idx + 1;
    obj.UserData = c;
    drawnow
else
    stop(obj);
end
