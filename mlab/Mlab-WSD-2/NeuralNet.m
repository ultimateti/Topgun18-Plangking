function varargout = NeuralNet(varargin)
% NEURALNET MATLAB code for NeuralNet.fig
%      NEURALNET, by itself, creates a new NEURALNET or raises the existing
%      singleton*.
%
%      H = NEURALNET returns the handle to a new NEURALNET or the handle to
%      the existing singleton*.
%
%      NEURALNET('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in NEURALNET.M with the given input arguments.
%
%      NEURALNET('Property','Value',...) creates a new NEURALNET or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before NeuralNet_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to NeuralNet_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help NeuralNet

% Last Modified by GUIDE v2.5 10-Jan-2018 16:00:30

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @NeuralNet_OpeningFcn, ...
                   'gui_OutputFcn',  @NeuralNet_OutputFcn, ...
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


% --- Executes just before NeuralNet is made visible.
function NeuralNet_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to NeuralNet (see VARARGIN)

% Choose default command line output for NeuralNet
handles.output = hObject;
% Update handles structure
guidata(hObject, handles);

% UIWAIT makes NeuralNet wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = NeuralNet_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;
guidata(hObject, handles);


% --- Executes on button press in trainButton.
function trainButton_Callback(hObject, eventdata, handles)
% hObject    handle to trainButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.predictButton.Enable = 'On';
filename = uigetfile('*.csv');
handles.data = importfile(filename);

handles.data.OATC = 5/9 * (handles.data.OATF - 32);

filt = get(handles.filterButton,'Value');

cond = ((handles.data.Timestamp < datetime('now')-years(8)) & (handles.data.Timestamp >= datetime('now')-days(7)-years(8)));

if (filt == 1)
    filData = movmean(handles.data.PowerkW, 12);
    x = [1:size(filData,1)]';
    F = @(b,x) b(1) + b(2)*sin(x) + b(3)*sin(3*x) + b(4)*sin(5*x) + b(5)*sin(7*x) + b(6)*sin(9*x) + b(7)*sin(11*x);
    mdl = fitnlm(x, filData,F, [1,1,1,1,1,1,1]);
    handles.data.PowerkW = feval(mdl, x);
    
    filData = movmean(handles.data.OATC, 12);
    x = [1:size(filData,1)]';
    F = @(b,x) b(1) + b(2)*sin(x) + b(3)*sin(3*x) + b(4)*sin(5*x) + b(5)*sin(7*x) + b(6)*sin(9*x) + b(7)*sin(11*x);
    mdl = fitnlm(x, filData,F, [1,1,1,1,1,1,1]);
    handles.data.OATC = feval(mdl, x);
end
    axes(handles.graphC);
    plot(handles.data.Timestamp(cond),handles.data.OATC(cond),'r');
    axes(handles.graphKW);
    handles.graphkW = plot(handles.data.Timestamp(cond),handles.data.PowerkW(cond),'b');

handles.data.DayNumber = weekday(handles.data.Timestamp);
day1 = ceil(length(handles.data.DayNumber(handles.data.DayNumber == 1))/96);
day2 = ceil(length(handles.data.DayNumber(handles.data.DayNumber == 2))/96);
day3 = ceil(length(handles.data.DayNumber(handles.data.DayNumber == 3))/96);
day4 = ceil(length(handles.data.DayNumber(handles.data.DayNumber == 4))/96);
day5 = ceil(length(handles.data.DayNumber(handles.data.DayNumber == 5))/96);
day6 = ceil(length(handles.data.DayNumber(handles.data.DayNumber == 6))/96);
day7 = ceil(length(handles.data.DayNumber(handles.data.DayNumber == 7))/96);
handles.listBox.String = sprintf('Sunday - %d days\nMonday - %d days \nTuesday - %d days \nWednesday - %d days \nThursday - %d days \nFriday - %d days \nSaturday - %d days',day1,day2,day3,day4,day5,day6,day7);
handles.avgText.String = sprintf('%2f C / %3f kW',mean(handles.data.OATC),mean(handles.data.PowerkW))
guidata(hObject, handles);


% --- Executes on button press in predictButton.
function predictButton_Callback(hObject, eventdata, handles)
% hObject    handle to predictButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

%1. Collect, preprocess, and label data

row1 = handles.data.DayNumber;
row2 = handles.data.OATC;
row3 = handles.data.PowerkW;
nnData = [row1,row2,row3];
inputs = nnData';
targets = row3';

input1 = get(handles.edit1,'Value');
input1 = str2double(input1);

[row4,~,~] = myNeuralNetworkFunction(inputs,input1,targets);
disp('Netural');

output = row4(floor(datenum(datetime('now') - datetime('1/1/2010'))*4));

handles.predictText.String = sprintf('%3f kW',output*4);
guidata(hObject, handles);
% --- Executes on selection change in listBox.

function listBox_Callback(hObject, eventdata, handles)
% hObject    handle to listBox (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: contents = cellstr(get(hObject,'String')) returns listBox contents as cell array
%        contents{get(hObject,'Value')} returns selected item from listBox
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function listBox_CreateFcn(hObject, eventdata, handles)
% hObject    handle to listBox (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: listbox controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end
guidata(hObject, handles);

% --- Executes on button press in filterButton.
function filterButton_Callback(hObject, eventdata, handles)
% hObject    handle to filterButton (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of filterButton
guidata(hObject, handles);


function edit1_Callback(hObject, eventdata, handles)
% hObject    handle to edit1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of edit1 as text
%        str2double(get(hObject,'String')) returns contents of edit1 as a double
guidata(hObject, handles);

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
guidata(hObject, handles);
