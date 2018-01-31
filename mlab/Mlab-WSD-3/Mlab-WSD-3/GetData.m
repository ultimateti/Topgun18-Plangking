function data = GetData(type)
    url = ['http://128.199.158.8:3000/api/',type,'/45/All'];
    options = weboptions('Timeout',20);
    dataGet = webread(url,options);
    data = struct2table(dataGet.data);
    
    data.date = strrep(data.date,'T',' ');
    data.date = strrep(data.date, '.000Z','');
    data.date = datetime(data.date);
    if(strcmp(type,'temperature') || strcmp(type,'pressure') || strcmp(type,'humidity'))
        data.val = str2double(data.val);
    else
        data.val_x = str2double(data.val_x);
        data.val_y = str2double(data.val_y);
        data.val_z = str2double(data.val_z);
    end
end