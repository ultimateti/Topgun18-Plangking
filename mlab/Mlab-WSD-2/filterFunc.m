function output = filter(data)
    filData = movmean(data, 48)
    x = [1:size(filData,1)]';
    F = @(b,x) b(1) + b(2)*sin(x);
    mdl = fitnlm(x, filData,F, [1,1]);
    ypredict = feval(mdl, x);
end
