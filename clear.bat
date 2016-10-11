@echo off
if {%1} == {} (
    for /f "delims=" %%A in ('dir /b /ad-h') do (
        echo "%%A"
        rem 删除除node_modules目录下的指定文件
        if /I not "%%A"=="node_modules" (
            del "%%A\*.pyc" /s
            del "%%A\*.bak" /s
            del "%%A\*.orig" /s
        )
    )
) else (
  del log\* /q /f /s
)
pause