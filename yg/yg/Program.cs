
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Data.SQLite;
using Npgsql;
using Renci.SshNet;

namespace yg
{
	public static  class Strings
	{
		public const int LCMAP_SIMPLIFIED_CHINESE = 0x02000000;
		public const int LCMAP_TRADITIONAL_CHINESE = 0x04000000;
		[DllImport("kernel32.dll", EntryPoint = "LCMapStringA")]
		public static extern int LCMapString(int Locale, int dwMapFlags, byte[] lpSrcStr, int cchSrc, byte[] lpDestStr, int cchDest);
		private static void AppendCharAsUnicodeJavaScript(StringBuilder builder, char c)
		{
			builder.AppendFormat("\\u{0:x4}", (int)c);
		}
		private static bool CharRequiresJavaScriptEncoding(char c)
		{
			return
            c < 0x20// control chars always have to be encoded
			|| c == '\"'// chars which must be encoded per JSON spec
			|| c == '\\'
			|| c == '\''// HTML-sensitive chars encoded for safety
			|| c == '<'
			|| c == '>'
			|| (c == '&')
			|| c == '\u0085'// newline chars (see Unicode 6.2, Table 5-1 [http://www.unicode.org/versions/Unicode6.2.0/ch05.pdf]) have to be encoded
			|| c == '\u2028'
			|| c == '\u2029';
		}
		private static string Concatenate(this IEnumerable<string> strings,
			Func<StringBuilder, string, StringBuilder> builderFunc)
		{
			return strings.Aggregate(new StringBuilder(), builderFunc).ToString();
		}
		// https://crates.io/crates/convert_case
		public static string Camel(this string value)
		{
			return
            Regex.Replace(
				Regex.Replace(value, "[\\-_ ]+([a-zA-Z])", m => m.Groups[1].Value.ToUpper()),
				"\\s+",
				""
			);
		}
		public static String Capitalize(this String s)
		{
			if (string.IsNullOrEmpty(s))
				return s;
			if (s.Length == 1)
				return s.ToUpper();
			if (char.IsUpper(s[0]))
				return s;
			return char.ToUpper(s[0]) + s.Substring(1);
		}
		public static string ConcatenateLines(this IEnumerable<string> strings)
		{
			return Concatenate(strings, (StringBuilder builder, string nextValue) => builder.AppendLine(nextValue));
		}
		public static string Concatenates(this IEnumerable<string> strings, string separator)
		{
			return Concatenate(strings,
				(StringBuilder builder, string nextValue) => builder.Append(nextValue).Append(separator));
		}
		public static string Concatenates(this IEnumerable<string> strings)
		{
			return Concatenate(strings, (builder, nextValue) => builder.Append(nextValue));
		}
		public static String Decapitalize(this String s)
		{
			if (string.IsNullOrEmpty(s))
				return s;
			if (s.Length == 1)
				return s.ToUpper();
			if (char.IsLower(s[0]))
				return s;
			return char.ToLower(s[0]) + s.Substring(1);
		}
		public static string GetDesktopPath(this string f)
		{
			return Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), f);
		}
		public static string JavaScriptStringEncode(string value)
		{
			if (string.IsNullOrEmpty(value)) {
				return string.Empty;
			}
			StringBuilder b = null;
			int startIndex = 0;
			int count = 0;
			for (int i = 0; i < value.Length; i++) {
				char c = value[i];
				// Append the unhandled characters (that do not require special treament)
				// to the string builder when special characters are detected.
				if (CharRequiresJavaScriptEncoding(c)) {
					if (b == null)
						b = new StringBuilder(value.Length + 5);
					if (count > 0) {
						b.Append(value, startIndex, count);
					}
					startIndex = i + 1;
					count = 0;
					switch (c) {
						case '\r':
							b.Append("\\r");
							break;
						case '\t':
							b.Append("\\t");
							break;
						case '\"':
							b.Append("\\\"");
							break;
						case '\\':
							b.Append("\\\\");
							break;
						case '\n':
							b.Append("\\n");
							break;
						case '\b':
							b.Append("\\b");
							break;
						case '\f':
							b.Append("\\f");
							break;
						default:
							AppendCharAsUnicodeJavaScript(b, c);
							break;
					}
				} else {
					count++;
				}
			}
			if (b == null) {
				return value;
			}
			if (count > 0) {
				b.Append(value, startIndex, count);
			}
			return b.ToString();
		}
		public static void Log(this string message)
		{
		
			//Console.WriteLine(message);
		}
		public static string RemoveWhiteSpaceLines(this string str)
		{
			return string.Join(Environment.NewLine,
				str.Split(Environment.NewLine.ToCharArray(), StringSplitOptions.RemoveEmptyEntries)
                .Where(i => !string.IsNullOrWhiteSpace(i)));
		}
		public static string SubstringAfter(this string value, char delimiter)
		{
			var index = value.IndexOf(delimiter);
			if (index == -1)
				return value;
			else
				return value.Substring(index + 1);
		}
		public static string SubstringAfter(this string value, string delimiter)
		{
			var index = value.IndexOf(delimiter);
			if (index == -1)
				return value;
			else
				return value.Substring(index + delimiter.Length);
		}
		public static string SubstringAfterLast(this string value, char delimiter)
		{
			var index = value.LastIndexOf(delimiter);
			if (index == -1)
				return value;
			else
				return value.Substring(index + 1);
		}
		public static string SubstringBefore(this string value, char delimiter)
		{
			var index = value.IndexOf(delimiter);
			if (index == -1)
				return value;
			else
				return value.Substring(0, index);
		}
		public static string SubstringBefore(this string value, string delimiter)
		{
			var index = value.IndexOf(delimiter);
			if (index == -1)
				return value;
			else
				return value.Substring(0, index);
		}
		public static string SubstringBeforeLast(this string value, string delimiter)
		{
			var index = value.LastIndexOf(delimiter);
			if (index == -1)
				return value;
			else
				return value.Substring(0, index);
		}
		public static string SubstringTakeout(this string value, string startDelimiter, string endDelimiter)
		{
			var startIndex = value.LastIndexOf(startDelimiter);
			if (startIndex == -1)
				return value;
			var endIndex = value.LastIndexOf(endDelimiter, startIndex + startDelimiter.Length);
			if (endIndex == -1)
				return value;
			return value.Substring(0, startIndex) + value.Substring(endIndex + endDelimiter.Length);
		}
		public static string SubstringBlock(this string value, string delimiter, string s)
		{
			var startIndex = value.LastIndexOf(delimiter);
			if (startIndex == -1)
				return value;
			var count = 0;
			startIndex += delimiter.Length;
			for (int index = startIndex; index < value.Length; index++) {
	
				if (value[index] == '{') {
					count++;
				} else if (value[index] == '}') {
					count--;
					if (count == 0) {
						var s1 = value.Substring(0, startIndex);
						var s2 = s + value.Substring(index + 1);
						return value.Substring(0, startIndex) + s + value.Substring(index + 1);
					}
				}
			}
			return value;
		}
		public static IEnumerable<string> ToBlocks(this string value)
		{
			var count = 0;
			StringBuilder sb = new StringBuilder();
			List<string> ls = new List<string>();
			foreach (var t in value) {
				sb.Append(t);
				switch (t) {
					case '{':
						count++;
						continue;
					case '}':
						{
							count--;
							if (count == 0) {
								ls.Add(sb.ToString());
								sb.Clear();
							}
							continue;
						}
				}
			}
			return ls;
		}
		//转化方法
		public static string ToTraditional(string source, int type)
		{
			byte[] srcByte2 = Encoding.Default.GetBytes(source);
			byte[] desByte2 = new byte[srcByte2.Length];
			LCMapString(2052, type, srcByte2, -1, desByte2, srcByte2.Length);
			string des2 = Encoding.Default.GetString(desByte2);
			return des2;
		}
		public static string UpperCamel(this string value)
		{
			return value.Camel().Capitalize();
		}
		public static String Snake(this string s)
		{
			if (s == null)
				return null;
			s = Regex.Replace(s, "[A-Z]", m => "_" + m.Value.ToLower());
			return Regex.Replace(s, "[ -]+", m => "_")
			.TrimStart('_');
		}
		public static string GetEntryPath(this string name, bool b = false)
		{
			var f = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), name);
			if (b) {
				if (!File.Exists(f))
					File.Create(f).Dispose();
			}
			return f;
			
		}
	}
	public static    class ClipboardShare
	{
		const uint cfUnicodeText = 13;
		[DllImport("shell32.dll", CharSet = CharSet.Unicode)]
		public static extern int DragQueryFile(IntPtr hDrop, int iFile, StringBuilder lpszFile, int cch);
		[DllImport("user32.dll", SetLastError = true)]
		[return: MarshalAs(UnmanagedType.Bool)]
		static extern bool CloseClipboard();
		[DllImport("gdi32.dll")]
		static extern IntPtr CopyEnhMetaFile(IntPtr hemfSrc, string lpszFile);
		[DllImport("gdi32.dll")]
		static extern bool DeleteEnhMetaFile(IntPtr hemf);
		[DllImport("user32.dll")]
		static extern bool EmptyClipboard();
		[DllImport("User32.dll", SetLastError = true)]
		static extern IntPtr GetClipboardData(uint uFormat);
		[DllImport("kernel32.dll", SetLastError = true)]
		static extern IntPtr GlobalLock(IntPtr hMem);
		[DllImport("Kernel32.dll", SetLastError = true)]
		static extern int GlobalSize(IntPtr hMem);
		[DllImport("kernel32.dll", SetLastError = true)]
		[return: MarshalAs(UnmanagedType.Bool)]
		static extern bool GlobalUnlock(IntPtr hMem);
		[DllImport("User32.dll", SetLastError = true)]
		[return: MarshalAs(UnmanagedType.Bool)]
		static extern bool IsClipboardFormatAvailable(uint format);
		[DllImport("user32.dll", SetLastError = true)]
		[return: MarshalAs(UnmanagedType.Bool)]
		static extern bool OpenClipboard(IntPtr hWndNewOwner);
		[DllImport("user32.dll", SetLastError = true)]
		static extern IntPtr SetClipboardData(uint uFormat, IntPtr data);
		public static IEnumerable<string> GetFileNames()
		{
			if (!IsClipboardFormatAvailable(15)) {
				var n = GetText();
				if (Directory.Exists(n) || File.Exists(n)) {
					return new string[] { n };
				}
				return null;
			}
			IntPtr handle = IntPtr.Zero;
			try {
				OpenClipboard();
				handle = GetClipboardData(15);
				if (handle == IntPtr.Zero) {
					return null;
				}
				var count = DragQueryFile(handle, unchecked((int)0xFFFFFFFF), null, 0);
				if (count == 0) {
					return Enumerable.Empty<string>();
				}
				var sb = new StringBuilder(260);
				var files = new string[count];
				for (var i = 0; i < count; i++) {
					var charlen = DragQueryFile(handle, i, sb, sb.Capacity);
					var s = sb.ToString();
					if (s.Length > charlen) {
						s = s.Substring(0, charlen);
					}
					files[i] = s;
				}
				return files;
			} finally {
				CloseClipboard();
			}
		}
	
		public static string GetText()
		{
			if (!IsClipboardFormatAvailable(cfUnicodeText)) {
				return null;
			}
			IntPtr handle = IntPtr.Zero;
			IntPtr pointer = IntPtr.Zero;
			try {
				OpenClipboard();
				handle = GetClipboardData(cfUnicodeText);
				if (handle == IntPtr.Zero) {
					return null;
				}
				pointer = GlobalLock(handle);
				if (pointer == IntPtr.Zero) {
					return null;
				}
				var size = GlobalSize(handle);
				var buff = new byte[size];
				Marshal.Copy(pointer, buff, 0, size);
				return Encoding.Unicode.GetString(buff).TrimEnd('\0');
			} finally {
				if (pointer != IntPtr.Zero) {
					GlobalUnlock(handle);
				}
				CloseClipboard();
			}
		}
		public static void OpenClipboard()
		{
			var num = 10;
			while (true) {
				if (OpenClipboard(IntPtr.Zero)) {
					break;
				}
				if (--num == 0) {
					ThrowWin32();
				}
				System.Threading.Thread.Sleep(100);
			}
		}
		public static void SetText(string text)
		{
			OpenClipboard();
			EmptyClipboard();
			IntPtr hGlobal = IntPtr.Zero;
			try {
				var bytes = (text.Length + 1) * 2;
				hGlobal = Marshal.AllocHGlobal(bytes);
				if (hGlobal == IntPtr.Zero) {
					ThrowWin32();
				}
				var target = GlobalLock(hGlobal);
				if (target == IntPtr.Zero) {
					ThrowWin32();
				}
				try {
					Marshal.Copy(text.ToCharArray(), 0, target, text.Length);
				} finally {
					GlobalUnlock(target);
				}
				// https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setclipboarddata
				if (SetClipboardData(cfUnicodeText, hGlobal) == IntPtr.Zero) {
					ThrowWin32();
				}
				hGlobal = IntPtr.Zero;
			} finally {
				if (hGlobal != IntPtr.Zero) {
					Marshal.FreeHGlobal(hGlobal);
				}
				CloseClipboard();
			}
		}
		// https://github.com/nanoant/ChromeSVG2Clipboard/blob/e135818eb25be5f5f1076a3746b675e9228657d1/ChromeClipboardHost/Program.cs
		static void ThrowWin32()
		{
			throw new Win32Exception(Marshal.GetLastWin32Error());
		}
	}
	[StructLayout(LayoutKind.Sequential)]
	public struct MSG
	{
		public IntPtr hwnd;
		public IntPtr lParam;
		public int message;
		public int pt_x;
		public int pt_y;
		public int time;
		public IntPtr wParam;
	}
	[StructLayout(LayoutKind.Explicit, Size = 20)]
	public struct KeyboardHookStruct
	{
		[FieldOffset(16)]
		public IntPtr dwExtraInfo;
		[FieldOffset(8)]
		public int Flags;
		[FieldOffset(0)]
		public Key Key;
		[FieldOffset(4)]
		public int ScanCode;
		[FieldOffset(12)]
		public int Time;
	}
	public enum KeyStaus
	{
		KeyDown = 0x0100,
		KeyUp = 0x0101,
		SysKeyDown = 0x0104,
		SysKeyUp = 0x0105
	}
	public enum HookID
	{
		Callwndproc = 4,
		Callwndprocert = 12,
		Cbt = 5,
		Debug = 9,
		Foregroundidle = 11,
		GetMessage = 3,
		JournalPlayback = 1,
		JournalRecord = 0,
		Keyboard = 2,
		Keyboard_LL = 13,
		Mouse = 7,
		MouseLL = 14,
		MsgFilter = -1,
		Shell = 10,
		SysmsgFilter = 6
	}
	public enum Key
	{
		LeftButton = 0x01,
		RightButton = 0x02,
		Cancel = 0x03,
		MiddleButton = 0x04,
		XButton1 = 0x05,
		XButton2 = 0x06,
		BackSpace = 0x08,
		Tab = 0x09,
		Clear = 0x0C,
		Return = 0x0D,
		Enter = Return,
		Shift = 0x10,
		Control = 0x11,
		Menu = 0x12,
		Pause = 0x13,
		CapsLock = 0x14,
		IMEKana = 0x15,
		IMEHanguel = IMEKana,
		IMEHangul = IMEKana,
		IMEJunja = 0x17,
		IMEFinal = 0x18,
		IMEHanja = 0x19,
		IMEKanji = IMEHanja,
		Escape = 0x1B,
		IMEConvert = 0x1C,
		IMENonConvvert = 0x1D,
		IMEAccept = 0x1E,
		IMEModeChange = 0x1F,
		SpaceBar = 0x20,
		PageUp = 0x21,
		PageDown = 0x22,
		End = 0x23,
		Home = 0x24,
		Left = 0x25,
		Up = 0x26,
		Right = 0x27,
		Down = 0x28,
		Select = 0x29,
		Print = 0x2A,
		Execute = 0x2B,
		Snapshot = 0x2C,
		Insert = 0x2D,
		Delete = 0x2E,
		Help = 0x2F,
		Key0 = 0x30,
		Key1 = 0x31,
		Key2 = 0x322,
		Key3 = 0x33,
		Key4 = 0x34,
		Key5 = 0x35,
		Key6 = 0x36,
		Key7 = 0x37,
		Key8 = 0x38,
		Key9 = 0x39,
		KeyA = 0x41,
		KeyB = 0x42,
		KeyC = 0x43,
		KeyD = 0x44,
		KeyE = 0x45,
		KeyF = 0x46,
		KeyG = 0x47,
		KeyH = 0x48,
		KeyI = 0x49,
		KeyJ = 0x4A,
		KeyK = 0x4B,
		KeyL = 0x4C,
		KeyM = 0x4D,
		KeyN = 0x4E,
		KeyO = 0x4F,
		KeyP = 0x50,
		KeyQ = 0x51,
		KeyR = 0x52,
		KeyS = 0x53,
		KeyT = 0x54,
		KeyU = 0x55,
		KeyV = 0x56,
		KeyW = 0x57,
		KeyX = 0x58,
		KeyY = 0x59,
		KeyZ = 0x5A,
		LeftWinKey = 0x5B,
		RightWinKey = 0x5C,
		AppsKey = 0x5D,
		Sleep = 0x5F,
		NumPad0 = 0x60,
		NumPad1 = 0x61,
		NumPad2 = 0x62,
		NumPad3 = 0x63,
		NumPad4 = 0x64,
		NumPad5 = 0x65,
		NumPad6 = 0x66,
		NumPad7 = 0x67,
		NumPad8 = 0x68,
		NumPad9 = 0x69,
		Multiply = 0x6A,
		Add = 0x6B,
		Separator = 0x6C,
		Subtract = 0x6D,
		Decimal = 0x6E,
		Divide = 0x6F,
		F1 = 0x70,
		F2 = 0x71,
		F3 = 0x72,
		F4 = 0x73,
		F5 = 0x74,
		F6 = 0x75,
		F7 = 0x76,
		F8 = 0x77,
		F9 = 0x78,
		F10 = 0x79,
		F11 = 0x7A,
		F12 = 0x7B,
		F13 = 0x7C,
		F14 = 0x7D,
		F15 = 0x7E,
		F16 = 0x7F,
		F17 = 0x80,
		F18 = 0x81,
		F19 = 0x82,
		F20 = 0x83,
		F21 = 0x84,
		F22 = 0x85,
		F23 = 0x86,
		F24 = 0x87,
		NumLock = 0x90,
		ScrollLock = 0x91,
		OEM92 = 0x92,
		OEM93 = 0x93,
		OEM94 = 0x94,
		OEM95 = 0x95,
		OEM96 = 0x96,
		LeftShfit = 0xA0,
		RightShfit = 0xA1,
		LeftCtrl = 0xA2,
		RightCtrl = 0xA3,
		LeftMenu = 0xA4,
		RightMenu = 0xA5,
		BrowserBack = 0xA6,
		BrowserForward = 0xA7,
		BrowserRefresh = 0xA8,
		BrowserStop = 0xA9,
		BrowserSearch = 0xAA,
		BrowserFavorites = 0xAB,
		BrowserHome = 0xAC,
		BrowserVolumeMute = 0xAD,
		BrowserVolumeDown = 0xAE,
		BrowserVolumeUp = 0xAF,
		MediaNextTrack = 0xB0,
		MediaPreviousTrack = 0xB1,
		MediaStop = 0xB2,
		MediaPlayPause = 0xB3,
		LaunchMail = 0xB4,
		LaunchMediaSelect = 0xB5,
		LaunchApp1 = 0xB6,
		LaunchApp2 = 0xB7,
		OEM1 = 0xBA,
		OEMPlus = 0xBB,
		OEMComma = 0xBC,
		OEMMinus = 0xBD,
		OEMPeriod = 0xBE,
		OEM2 = 0xBF,
		OEM3 = 0xC0,
		OEM4 = 0xDB,
		OEM5 = 0xDC,
		OEM6 = 0xDD,
		OEM7 = 0xDE,
		OEM8 = 0xDF,
		OEM102 = 0xE2,
		IMEProcess = 0xE5,
		Packet = 0xE7,
		Attn = 0xF6,
		CrSel = 0xF7,
		ExSel = 0xF8,
		EraseEOF = 0xF9,
		Play = 0xFA,
		Zoom = 0xFB,
		PA1 = 0xFD,
		OEMClear = 0xFE
	}
	public   class KeyboardShare
	{
		public delegate IntPtr KeyboardHookProc(int code, IntPtr wParam, IntPtr lParam);
		public delegate void KeyEvent(object sender, KeyEventArg e);
		private event KeyboardHookProc keyhookevent;
		public event KeyEvent KeyDown;
		public event KeyEvent KeyUp;
		private IntPtr hookPtr;
		public KeyboardShare()
		{
			this.keyhookevent += KeyboardHook_keyhookevent;
		}
		[DllImport("User32.dll")]
		private static extern IntPtr CallNextHookEx(IntPtr hook, int code, IntPtr wParam, IntPtr lParam);
		[DllImport("user32.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
		private static extern short GetKeyState(int keyCode);
		[DllImport("User32.dll")]
		private static extern IntPtr SetWindowsHookExA(HookID hookID, KeyboardHookProc lpfn, IntPtr hmod,
			int dwThreadId);
		[DllImport("user32.dll", CharSet = System.Runtime.InteropServices.CharSet.Auto)]
		public static extern int DispatchMessage([In] ref MSG msg);
		[DllImport("user32.dll")]
		public static extern sbyte GetMessage(out MSG lpMsg, IntPtr hWnd, uint wMsgFilterMin,
			uint wMsgFilterMax);
		[DllImport("user32.dll", CharSet = CharSet.Auto)]
		public static extern bool TranslateMessage([In, Out] ref MSG msg);
		[DllImport("kernel32.dll")]
		static extern IntPtr GetConsoleWindow();
		private IntPtr KeyboardHook_keyhookevent(int code, IntPtr wParam, IntPtr lParam)
		{
			KeyStaus ks = (KeyStaus)wParam.ToInt32();
			KeyboardHookStruct khs = (KeyboardHookStruct)Marshal.PtrToStructure(lParam, typeof(KeyboardHookStruct));
			KeyEvent ke = ks == KeyStaus.KeyDown || ks == KeyStaus.SysKeyDown ? KeyDown : KeyUp;
			if (ke != null) {
				ke.Invoke(this, new KeyEventArg() {
					Key = khs.Key,
					KeyStaus = ks
				});
			}
			return CallNextHookEx(IntPtr.Zero, code, wParam, lParam);
		}
		public void ConfigHook()
		{
			hookPtr = SetWindowsHookExA(HookID.Keyboard_LL, keyhookevent, IntPtr.Zero, 0);
			if (hookPtr == null)
				throw new Exception();
		}
		public static bool isKeyPressed(int keyCode)
		{
			return (GetKeyState(keyCode) & 0x8000) != 0;
		}
	}
	public   class KeyEventArg
	{
		public Key Key;
		public KeyStaus KeyStaus;
	}
	class Program
	{
		static void BuildSource()
		{
			string cs = "source.db".GetDesktopPath(); //Path.Combine(
			//  Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly().Location),
			//     "source.db"
			//); //@"URI=file:C:\Users\Jano\Documents\test.db";
			if (!File.Exists(cs))
				File.Create(cs).Dispose();
			var con = new SQLiteConnection("URI=file:" + cs);
			con.Open();
			var cmd = new SQLiteCommand(con);


			cmd.CommandText = @"CREATE TABLE IF NOT EXISTS source (
	id	INTEGER NOT NULL UNIQUE,
	path	TEXT NOT NULL UNIQUE,
	contents	TEXT,
	create_at	INTEGER,
	update_at	INTEGER,
	PRIMARY KEY(id AUTOINCREMENT)
);";
			cmd.ExecuteNonQuery();

			var dir = @"C:\Users\Administrator\Desktop\file\yg"; //@"C:\Users\Administrator\Desktop\file\yg";
			var files = Directory.GetFiles(dir, "*", SearchOption.AllDirectories);
			var regex = new Regex("\\.(?:rs|wxml|wxss|js|json|css|html|md|java|gradle|properties)$");
			// (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
			foreach (var file in files) {
				// .idea
				if (!regex.IsMatch(file) || file.Contains("\\target\\") || file.Contains("\\build\\")
				    || file.Contains("\\.idea\\")
				    || file.Contains("\\.git\\")
				    || file.Contains("\\app\\"))
					continue;
				cmd.CommandText = @"INSERT INTO source (path,contents,create_at,update_at) VALUES (@path,@contents,@create_at,@update_at)";
				cmd.Parameters.AddWithValue("@path", file);
				cmd.Parameters.AddWithValue("@contents", File.ReadAllText(file));
				cmd.Parameters.AddWithValue("@create_at", (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds);
				cmd.Parameters.AddWithValue("@update_at", (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds);
				cmd.Prepare();
				cmd.ExecuteNonQuery();
			}
			Console.WriteLine("Success");

		}
		private static List<string> CollectRoutes(string dir)
		{
			var files = Directory.GetFiles(dir, "*.rs");
			var lines = new List<string>();
			var list = new List<string>();
			foreach (var element in files) {
				var content = File.ReadAllText(element);
				var matches = Regex.Matches(content, "\\]+\\s+pub +(async +)*fn +([a-z_]+)(?=[<(])")
					.Cast<Match>()
					.Where(x => x.Groups[2].Value != "not_found")
					.Select(x => string.Format("{0}::{1}::{2}", Path.GetFileNameWithoutExtension(dir), Path.GetFileNameWithoutExtension(element), x.Groups[2].Value));
				lines.AddRange(matches);
				
				list.AddRange(
					Regex.Matches(content, "#\\[(get|post)([^\\]]+)\\]")
					.Cast<Match>()
					.Select(x => x.Value.SubstringAfter("\"").SubstringBefore("\"") + " = " + Path.GetFileName(element))
				);
				File.WriteAllText(element, content.RemoveWhiteSpaceLines());
			}
			
			return lines;
			
		}
		private static void WriteRoutes(string dir, string file)
		{
			var lines = CollectRoutes(dir);
			
			var contents = Regex.Replace(File.ReadAllText(file),
				               "(?<=routes!\\[)[^\\]]*?(?=\\])",
				               string.Join(",\n", lines));
			
			File.WriteAllText(file, contents);
		}
		static void CompileWeixin()
		{
			string name = "admin"; //admin weixin
			var p = Process.Start(new ProcessStartInfo {
				FileName = "cmd",
				Arguments = @"/c wasm-pack build --target web --out-dir C:\Users\Administrator\Desktop\pkg",
				WorkingDirectory = @"C:\Users\Administrator\Desktop\file\yg\WebAssembly\" + name
			});
			p.WaitForExit();
			CleanAssembly(name);
		}
		static void CompileServer()
		{
			var p = Process.Start(new ProcessStartInfo {
				FileName = "cmd",
				Arguments = @"/c set DB_HOST=159.75.78.126&&set DB_PORT=3389&&set DB_PASSWORD=991578aa&&set APPID=wx915afa9083177059&&set IMAGE_DIR=C:\Users\Administrator\Desktop\file\yg\images&&set SECRET=4d3c7d657e87bd90b75e77ec2868d39f&&cargo run",
				WorkingDirectory = @"C:\Users\Administrator\Desktop\file\yg\server"
			});
			p.WaitForExit();
		}

		static void CreateHandler()
		{
			var dir = @"C:\Users\Administrator\Desktop\file\yg\server\src";
			var fn = ClipboardShare.GetText().Trim();
			var f = Path.Combine(Path.Combine(dir, "handlers"), fn + ".rs");
			if (!File.Exists(f)) {
				File.WriteAllText(f, string.Empty);
			}
			f = Path.Combine(Path.Combine(dir, "handlers"), fn + ".md");
			if (!File.Exists(f)) {
				File.WriteAllText(f, string.Empty);
			}
			var files = Directory.GetFiles(Path.Combine(dir, "handlers"), "*.rs")
				.Where(x => Path.GetFileName(x) != "mod.rs")
				.Select(x => string.Format("pub mod {0};", Path.GetFileNameWithoutExtension(x)));
			File.WriteAllLines(Path.Combine(Path.Combine(dir, "handlers"), "mod.rs"), files);
			
			WriteRoutes(Path.Combine(dir, "handlers"),
				Path.Combine(dir, "main.rs")
			);
		}

		static void FormatQueryParameters()
		{
			var str = "id,start,end, openId";

			var stringBuilder = new StringBuilder();
			stringBuilder.AppendLine(string.Join("&", str.Split(',')
							                                   .Select(x => string.Format("<{0}>", x.Trim().Snake()))));
			stringBuilder.AppendLine(string.Join(",", str.Split(',')
							                                   .Select(x => string.Format("{0}:i32", x.Trim().Snake()))));
						
			stringBuilder.AppendLine(string.Join(",", str.Split(',')
                                     .Select(x => string.Format("&{0}", x.Trim().Snake()))));
			stringBuilder.AppendLine(string.Join(",", str.Split(',')
                                     .Select(x => string.Format("{0}", x.Trim().Snake()))));
			stringBuilder.AppendLine(string.Join("&", str.Split(',')
							                                   .Select(x => string.Format("{0}={{}}", x.Trim().Snake()))));
						
			stringBuilder.AppendLine(string.Join(",", Enumerable.Range(0, str.Split(',').Length).Select(x => string.Format("${0}", x + 1))));

			stringBuilder.AppendLine(string.Join("\n", str.Split(',')
							                                     .Select(x => string.Format("const {0} = 0;", x.Trim().Camel()))));
			stringBuilder.AppendLine(string.Join(",", str.Split(',')
							                                     .Select(x => string.Format("{0}", x.Trim().Camel()))));
												
			ClipboardShare.SetText(stringBuilder.ToString());
				
		}

		static void CopyStyles()
		{
			var f = ClipboardShare.GetFileNames().First(File.Exists);
			var s = File.ReadAllText(f);
			var matches = Regex.Matches(s, "(?<=css=\")[^\"]+(?=\")").Cast<Match>()
				.SelectMany(m => m.Value.Split(' '));
			var blocks = s.SubstringAfter("*/").ToBlocks()
				.Where(x => matches.Any(y => y == x.SubstringBefore('{').SubstringAfter(".").Trim()));
			ClipboardShare.SetText(string.Join(Environment.NewLine, blocks));
		}

		static void ExecuteSQL(string s)
		{
			var c = new NpgsqlConnection("Server=159.75.78.126;Port=3389;User Id=psycho;Password=991578aa;Database=yoga;");
			c.Open();
			var cmd = new NpgsqlCommand(s, c);
			var reader =	cmd.ExecuteReader();
			if (reader.Read()) {
				File.WriteAllText("1.txt".GetDesktopPath(), reader.GetString(0));
			}
		}

		static void CreatePage()
		{
			var dir = @"C:\Users\Administrator\Desktop\file\yg\miniprogram\pages";
			var s = ClipboardShare.GetText().Trim();
			dir = Path.Combine(dir, s);
			if (!Directory.Exists(dir)) {
				Directory.CreateDirectory(dir);
			}
			new List<string>(){ "js", "json", "wxml", "wxss" }
		 .ForEach(x => {
				var f = Path.Combine(dir, s + "." + x);
				if (!File.Exists(f)) {
					File.WriteAllText(f, File.ReadAllText(string.Format("weixin.{0}", x).GetEntryPath()));
				}
			});
			
			
		}

		static void FormatHandler()
		{
			var s = "fn_admin_lessons_update(obj json)";// ClipboardShare.GetText();
			var arrary = new List<string>();
			arrary.Add(s.SubstringBefore("(").Trim());
			var paramters = s.SubstringAfter("(").SubstringBefore(")");
			arrary.Add(string.Join(",", Enumerable.Range(1, paramters.Split(',').Count()).Select(x => "$" + x)));
			var paramters1 = paramters.Split(',').Select(x => x.Trim().SubstringBefore(' ').SubstringAfter('_'));
			arrary.Add(string.Join(",", paramters1.Select(x => "&" + x)));
			arrary.Add(s.SubstringBefore("(").Trim().SubstringAfter("_").Replace("_", "/"));
			arrary.Add(s.SubstringBefore("(").Trim().SubstringAfter("_"));
			arrary.Add("&" + string.Join("&", paramters1.Select(x => "<" + x + ">")));
			arrary.Add(string.Join(",", paramters1.Select(x => x + ":i32")) + ",");
			arrary.Add(s.SubstringBefore("(").Trim().SubstringAfter("_").SubstringAfter("_"));
			arrary.Add("," + string.Join(",", paramters1.Select(x => x + ":i32")));
			arrary.Add("&" + string.Join("&", paramters1.Select(x => x + "={}")));
			arrary.Add("," + string.Join(",", paramters1.Select(x => x)));
			arrary.Add("," + string.Join(",", paramters1.Select(x => x)));
			
			var contents = File.ReadAllText("handler.txt".GetEntryPath());
			contents = Regex.Replace(contents, "\\$\\{(\\d+)\\}", m => arrary[int.Parse(m.Groups[1].Value)]);
			ClipboardShare.SetText(contents);
		}

		static void UploadServer()
		{
			const string host = "159.75.78.126"; // "81.71.32.180"; "159.75.78.126";
			const string username = "root";
			const string password = "q4so4tDtz!"; // "12345Aa!"; // "q4so4tDtz!";
			try {
				var dir = @"C:\Users\Administrator\Desktop\file\yg\server";
				var files = Directory.GetFiles(dir, "*", SearchOption.AllDirectories);
				var memoryStream = new MemoryStream();
				var zip = new ZipArchive(memoryStream, ZipArchiveMode.Create, true);
				foreach (var item in files) {
					if (!item.Contains("\\target\\") && Regex.IsMatch(item, "\\.(?:rs||toml|png|ttf)$"))
						zip.CreateEntryFromFile(item, item.Substring(dir.Length + 1).Replace('\\', '/'));
				}
				memoryStream.Flush();
				zip.Dispose();
				memoryStream.Seek(0, SeekOrigin.Begin);
				using (var ftp = new SftpClient(host, username, password)) {
					ftp.Connect();
					var name = "/root/server.zip";
					ftp.UploadFile(memoryStream, name, true);
					Console.WriteLine(name);
					using (SshClient sshClient = new SshClient(host, username, password)) {
						sshClient.Connect();
			
//						RunCommand(sshClient, string.Format("unzip {0} -d /root/y", name));
						RunCommand(sshClient, "rm -rf /root/server/src && unzip -o /root/server.zip -d /root/server");
						// which cargo
						RunCommand(sshClient, "cd /root/server && /root/.cargo/bin/cargo build --release");
						RunCommand(sshClient, "systemctl stop yoga-server && cd /root/server && mv target/release/YogaServer /root/bin/YogaServer");
						RunCommand(sshClient, "systemctl restart yoga-server");
						
//						RunCommand(sshClient, "cd /root/y && /usr/local/go/bin/go build -o /root/bin/y");
//						RunCommand(sshClient, "rm -rf /root/y");
//						RunCommand(sshClient, "sudo systemctl start Yoga.service");
					}
				}
			} catch (System.Exception ex) {
				Console.WriteLine(ex.Message);
			}
		}
		static void RunCommand(SshClient sshClient, string commandText)
		{
			var n = sshClient.RunCommand(commandText);
			Console.WriteLine("RunCommand: {0} \nResult = {1} \nError = {2}", commandText, n.Result, n.Error);
		}

		static void ReplaceString()
		{
			var s=ClipboardShare.GetText().Trim();
			
			ClipboardShare.SetText(string.Format(@"<view class=""grid-wrapper"">
        <view class=""grid-title"">课程</view>
        <view class=""grid"">
            <view class=""{{{{lessonSelectedIndex===index?'selected':''}}}}"" wx:for=""{{{{lessons}}}}"" wx:key=""*this"" data-index=""{{{{index}}}}"" bind:tap=""onLesson"">
                <view>{{{{item}}}}</view>
            </view>
        </view>
    </view>
     lessonSelectedIndex: 0,
onLesson(e) {{
        this.setData({{ lessonSelectedIndex: e.currentTarget.dataset.index }});
    }},

".Replace("lesson",s)
			                       .Replace("lesson".UpperCamel(),s.UpperCamel())
			                      ));
		}

			public static void FormatString()
		{
			var s = ClipboardShare.GetText();
			s = s.Replace("\"", "\"\"")
			.Replace("{", "{{")
			.Replace("}", "}}");
			// ClipboardShare.SetText()
			//s = string.Format("var strings=ClipboardShare.GetText().Trim();\nClipboardShare.SetText(string.Format(@\"{0}\"));", s);
			s = string.Format("{0}", s);
			//s = string.Format("string.Format(@\"{0}\")", s);
			ClipboardShare.SetText(string.Format("{0}", s));
		}
		public static void CleanAssembly(string name)
		{
			var filename = @"C:\Users\Administrator\Desktop\pkg\" + name + ".js";
			RefactorWebAssemblyForWechat(filename, name);
//			var dir =Path.GetDirectoryName(filename);
//			Directory.GetFiles(dir, "*")
//				.ToList()
//				.ForEach(x => {
//				if (!Regex.IsMatch(x, "\\.(?:js|wasm)$")) {
//					File.Delete(x);
//				}
//			});
			var dir = @"C:\Users\Administrator\Desktop\file\yg\miniprogram\pkg";
			File.Copy(filename, Path.Combine(dir, Path.GetFileName(filename)), true);
			filename = @"C:\Users\Administrator\Desktop\pkg\" + name + "_bg.wasm";
			File.Copy(filename, Path.Combine(dir, Path.GetFileName(filename)), true);
		}

		public static void RefactorWebAssemblyForWechat(string fileName, string name)
		{
		
			var s = File.ReadAllText(fileName);
			
			s = s.SubstringBlock("async function load(module, imports)", string.Format(@"{{
  const instance = await WXWebAssembly.instantiate(module, imports);
  return instance;
}}"));
			s = s.SubstringBlock("async function init(input)", "");
			s = s.SubstringBlock("function initSync(module)", "");
			s = s.Replace("export { initSync }", "");
			s = s.Replace("function initSync(module)", "");
			s = s.Replace("async function init(input)", string.Format(@"
			async function init(){{


    const imports = getImports();


    initMemory(imports);

    const {{ instance, module }} = await load(""/pkg/{0}_bg.wasm"", imports);

    return finalizeInit(instance, module);

}}
", name));
			File.WriteAllText(fileName, "const shared=require(\"../utils/shared\");\n" + @"const  encoding = require('../utils/encoding');
const  TextDecoder = TextDecoder?TextDecoder:encoding.TextDecoder;
const TextEncoder = TextEncoder?TextEncoder:encoding.TextEncoder;
" + s);
		 
		}
		static void DumpSource()
		{
			string cs = "source.db".GetDesktopPath();
			
			if (!File.Exists(cs)) {
				return;
			}
			var con = new SQLiteConnection("URI=file:" + cs);
			con.Open();
			var cmd = new SQLiteCommand(con);





			cmd.CommandText = @"SELECT path,contents FROM source";

			cmd.Prepare();
			var reader = cmd.ExecuteReader();
			while (reader.Read()) {
				File.WriteAllText(reader.GetString(0), reader.GetString(1));
			}
			Console.WriteLine("Success");

		}
		public static void Main(string[] args)
		{
			var fn = Path.GetFileNameWithoutExtension(Assembly.GetEntryAssembly().Location);
		
			if (fn.EndsWith("2")) {
				CreateHandler();
			} else if (fn.EndsWith("3")) {
				var dir = ClipboardShare.GetFileNames().First(Directory.Exists);
				var files = Directory.GetFiles(dir, "*.rs")
					.Where(x => Path.GetFileName(x) != "mod.rs")
					.Select(x => "pub mod " + Path.GetFileNameWithoutExtension(x) + ";");
				File.WriteAllLines(Path.Combine(dir, "mod.rs"), files);
				
			}
			/*
			new List<string>(){ "js", "json", "wxml", "wxss" }
			.ForEach(x => {string.Format("weixin.{0}",  x).GetEntryPath(true);
			         });
			         */
			"handler.txt".GetEntryPath(true);
			var kbh = new KeyboardShare();
			kbh.ConfigHook();
			kbh.KeyDown += async (s, k) => {
				switch (k.Key) {
					case Key.F1:
						{
							break;
						}
					case Key.F2:
						{
							break;
						}
					case Key.F3:
						{
							try {
								ExecuteSQL(ClipboardShare.GetText());
								// 
								//ExecuteSQL("update \"user\" set avatar_url='https://chenyunyoga.cn/' where open_id='oQOVx5Dxk0E6NQO-Ojoyuky2GVR8';");
								
								//ExecuteSQL("update \"user\" set user_type = 4 where open_id='oQOVx5Dxk0E6NQO-Ojoyuky2GVR8';");
								//"update \"user\" set user_type = 4 where open_id='oQOVx5Dxk0E6NQO-Ojoyuky2GVR8';");
								//"delete from \"user\" where open_id='oQOVx5Dxk0E6NQO-Ojoyuky2GVR8';");
							} catch (Exception e) {
								Console.WriteLine(e.Message);
							}
							break;
						}
					case Key.F4:
						{
							CopyStyles();
							break;
						}
					case Key.F5:
						{
							FormatQueryParameters();

							break;
						}
					case Key.F6:
						{
//							var dir = @"C:\Users\Administrator\Desktop\file\yg\server\src";
//								
//							WriteRoutes(Path.Combine(dir, "handlers"),
//								Path.Combine(dir, "main.rs")
//							);
							//
							  FormatHandler();
							break;
						}
					case Key.F7:
						{
							CompileWeixin();
							break;
						}
					case Key.F8:
						{
							CompileServer();
							break;
						}
					case Key.F9:
						{
							FormatString();
							break;
						}
					case Key.F10:
						{
							var lines = Directory.GetFiles(@"C:\Users\Administrator\Desktop\file\yg\images")
								.Where(x => Path.GetFileName(x).StartsWith("Screenshot"))
								.Select(x => {
								        
								return string.Format("<img width=\"250\" src=\"images/{0}\">", Path.GetFileName(x));
							});
							ClipboardShare.SetText(string.Join(Environment.NewLine, lines));
							break;
						}
					case Key.F11:
						{
							BuildSource();  
							break;
						}
					case Key.F12:
						{
							DumpSource();
							break;
						}
					case Key.NumPad1:
						{
							ReplaceString();
							break;
						}
					case Key.NumPad7:
						{
							CreateHandler();
							break;
						}
					case Key.NumPad8:
						{
							 CreatePage();
							break;
						}
					case Key.NumPad9:
						UploadServer();
						break;
				}
			};
			/*
			 (() => {

    console.log([...new Array(13).keys()]
        .map(x => `case Key.F${x+1}:
       {
           break;
       }`).join('\n'));
})();
			 */
			
			MSG message;
			while (KeyboardShare.GetMessage(out message, IntPtr.Zero, 0, 0) != 0) {
				KeyboardShare.TranslateMessage(ref message);
				KeyboardShare.DispatchMessage(ref message);
			}
		}
	
	}
	
}