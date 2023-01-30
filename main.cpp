#include <iostream>
#include <windows.h>
#include <vector>

void Click(int x, int y) {
    SetCursorPos(x, y);
    mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
    Sleep(150);
    mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
}

std::vector<POINT> points;

DWORD WINAPI Strategy2(LPVOID lpParam) {
    for (int i = 0; i < points.size(); ++i) {
        Click(points[i].x, points[i].y);
        Sleep(6000);
    }
    return 0;
}
DWORD WINAPI Strategy3(LPVOID lpParam) {
    while(true){
         keybd_event( 0x32,
                      MapVirtualKeyA(0x32,0),
                      KEYEVENTF_EXTENDEDKEY | 0,
                      0 );

         keybd_event( 0x32,
                          MapVirtualKeyA(0x32,0),
                      KEYEVENTF_EXTENDEDKEY | KEYEVENTF_KEYUP,
                      0);
                      Sleep(1000);
                      keybd_event( 0x33,
                      MapVirtualKeyA(0x33,0),
                      KEYEVENTF_EXTENDEDKEY | 0,
                      0 );

         keybd_event( 0x33,
                          MapVirtualKeyA(0x33,0),
                      KEYEVENTF_EXTENDEDKEY | KEYEVENTF_KEYUP,
                      0);
                      Sleep(1000);
                      
    }
    return 0;
}
int main() {
    if (RegisterHotKey(nullptr, VK_F1, 0, VK_F1)) {

    }
    if (RegisterHotKey(nullptr, VK_F9, 0, VK_F9)) {

    }
    if (RegisterHotKey(nullptr, VK_F10, 0, VK_F10)) {

    }

    HANDLE thread;
    HANDLE thread1;
    bool status;
     bool status1;
    DWORD dwThreadId;
    DWORD dwThreadId1;
    MSG msg = {};
    while (GetMessage(&msg, nullptr, 0, 0) != 0) {
        if (msg.message != WM_HOTKEY)
            continue;
        if (msg.wParam == VK_F9) {
            if (!thread) {
                thread =
                        CreateThread(nullptr, 0, Strategy2, nullptr, 0, &dwThreadId);
                status = true;
            } else {
                if (status) {
                    // https://docs.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-suspendthread
                    //
                    TerminateThread(thread, 0);
                    status = false;
                    points.clear();
                } else {
                    thread = CreateThread(nullptr, 0, Strategy2, nullptr, 0, &dwThreadId);
                    status = TRUE;
                }
            }
        }
        if (msg.wParam == VK_F1) {
            if (!thread1) {
                thread1 =
                        CreateThread(nullptr, 0, Strategy3, nullptr, 0, &dwThreadId1);
                status1 = true;
            } else {
                if (status1) {
                    // https://docs.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-suspendthread
                    //
                    TerminateThread(thread1, 0);
                    status1 = false;
                } else {
                    thread1 = CreateThread(nullptr, 0, Strategy3, nullptr, 0, &dwThreadId1);
                    status1 = TRUE;
                }
            }
        }
        if (msg.wParam == VK_F10) {
            POINT p;
            GetCursorPos(&p);
            points.push_back(p);
        }


    }
    return 0;
}
