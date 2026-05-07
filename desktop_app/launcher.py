import webview
import sys
import os

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

def launch_app():
    # Application Config
    APP_NAME = "CraftSathi"
    LIVE_URL = "https://craftsathi.prakharsrivastava019.workers.dev/"
    ICON_PATH = resource_path(os.path.join("assets", "icon.ico"))

    print(f"Launching {APP_NAME}...")
    
    # Create window
    window = webview.create_window(
        title=APP_NAME,
        url=LIVE_URL,
        width=1200,
        height=800,
        resizable=True,
        confirm_close=True,
        background_color='#000000' # Matches dark theme
    )
    
    # Start the app
    # 'gui' can be 'edgehtml', 'mshtml', or 'cef' on Windows
    webview.start(icon=ICON_PATH if os.path.exists(ICON_PATH) else None)

if __name__ == "__main__":
    launch_app()
