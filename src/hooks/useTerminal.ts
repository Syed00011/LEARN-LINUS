import { useState, useCallback, useEffect } from 'react';
import { TerminalLine } from '../types';

interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileSystemNode[];
}

const INITIAL_FS: FileSystemNode = {
  name: '~',
  type: 'directory',
  children: [
    { name: 'welcome.txt', type: 'file', content: 'Welcome to LinuxLearner! Start by exploring the file system.' },
    { name: 'projects', type: 'directory', children: [] },
    { name: 'tutorials', type: 'directory', children: [
       { name: 'basics.md', type: 'file', content: 'Linux is a family of open-source Unix-like operating systems based on the Linux kernel.' }
    ]}
  ]
};

export function useTerminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', content: 'LinuxLearner Virtual Terminal v1.0.0' },
    { type: 'output', content: 'Type "help" to see available commands.' }
  ]);
  const [cwd, setCwd] = useState<string[]>([]); // Array of directory names representing the path
  const [fs, setFs] = useState<FileSystemNode>(INITIAL_FS);
  const [runningProcess, setRunningProcess] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [editorFileName, setEditorFileName] = useState<string | null>(null);

  const getDirectory = useCallback((pathList: string[], currentFs: FileSystemNode): FileSystemNode | null => {
    let current = currentFs;
    for (const part of pathList) {
      const next = current.children?.find(node => node.name === part && node.type === 'directory');
      if (!next) return null;
      current = next;
    }
    return current;
  }, []);

  const interrupt = useCallback(() => {
    if (runningProcess) {
      setHistory(prev => [...prev, { type: 'output', content: '^C' }]);
      setRunningProcess(null);
    }
  }, [runningProcess]);

  const execute = useCallback((input: string) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setHistory(prev => [...prev, { type: 'input', content: input }]);

    if (runningProcess) return;

    const [cmd, ...args] = trimmedInput.split(' ');

    const currentDir = getDirectory(cwd, fs);
    if (!currentDir) {
      setHistory(prev => [...prev, { type: 'error', content: 'FileSystem Error: Current directory lost.' }]);
      return;
    }

    const availableCommands = ['ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'rm', 'mv', 'cp', 'clear', 'help', 'whoami', 'df', 'du', 'free', 'ps', 'top', 'grep', 'chmod', 'chown', 'sudo', 'apt', 'systemctl', 'ip', 'ping', 'vim'];

    switch (cmd) {
      case 'vim':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', content: 'vim: missing filename' }]);
          return;
        }
        const existingFileForVim = currentDir.children?.find(n => n.name === args[0] && n.type === 'file');
        setEditorFileName(args[0]);
        setEditorContent(existingFileForVim ? (existingFileForVim.content || '') : '');
        setEditorMode(true);
        break;
      case 'help':
        setHistory(prev => [...prev, { type: 'output', content: `Available commands: ${availableCommands.join(', ')}` }]);
        setHistory(prev => [...prev, { type: 'output', content: 'Tip: Use "vim <filename>" to edit files. Use :wq to save and quit.' }]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'whoami':
        setHistory(prev => [...prev, { type: 'output', content: 'learner' }]);
        break;
      case 'pwd':
        setHistory(prev => [...prev, { type: 'output', content: '/' + cwd.join('/') }]);
        break;
      case 'df':
        setHistory(prev => [...prev, { type: 'output', content: 'Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/sda1      20641432 4291824  15281184  22% /' }]);
        break;
      case 'free':
        setHistory(prev => [...prev, { type: 'output', content: '              total        used        free      shared  buff/cache   available\nMem:        8163984     1234568     4567892      123456     2361524     6543210\nSwap:       2097148           0     2097148' }]);
        break;
      case 'ps':
        setHistory(prev => [...prev, { type: 'output', content: '  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 5678 pts/0    00:00:00 ps' }]);
        break;
      case 'top':
        setHistory(prev => [...prev, { type: 'output', content: 'top - 08:05:12 up 10 days, 2:14, 1 user, load average: 0.12, 0.05, 0.01\nTasks: 120 total, 1 running, 119 sleeping, 0 stopped, 0 zombie\n%Cpu(s): 2.5 us, 0.8 sy, 0.0 ni, 96.7 id' }]);
        break;
      case 'ping':
        if (!args[0]) { setHistory(prev => [...prev, { type: 'error', content: 'ping: missing destination' }]); break; }
        setRunningProcess('ping');
        setHistory(prev => [...prev, { type: 'output', content: `PING ${args[0]} (127.0.0.1) 56(84) bytes of data.` }]);
        
        const interval = setInterval(() => {
          setHistory(prev => {
            const lastLine = prev[prev.length - 1];
            const isLastPing = lastLine?.content?.includes('icmp_seq');
            const seq = isLastPing ? parseInt(lastLine.content.split('=')[1]) + 1 : 1;
            return [...prev, { type: 'output', content: `64 bytes from 127.0.0.1: icmp_seq=${seq} ttl=64 time=0.045 ms` }];
          });
        }, 1000);
        (window as any)._activePing = interval;
        break;
      case 'ip':
        setHistory(prev => [...prev, { type: 'output', content: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000\n    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff\n    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0' }]);
        break;
      case 'ls':
        const currentDirForLs = getDirectory(cwd, fs);
        if (!currentDirForLs) {
          setHistory(prev => [...prev, { type: 'error', content: 'ls: cannot access directory' }]);
          break;
        }
        const files = currentDirForLs.children?.map(n => n.name).join('  ') || '';
        setHistory(prev => [...prev, { type: 'output', content: files }]);
        break;
      case 'mkdir':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', content: 'mkdir: missing operand' }]);
          return;
        }
        // Validate existence first
        const dirToMkdir = getDirectory(cwd, fs);
        if (dirToMkdir?.children?.find(n => n.name === args[0])) {
          setHistory(prev => [...prev, { type: 'error', content: `mkdir: cannot create directory '${args[0]}': File exists` }]);
          return;
        }
        
        setFs(prevFs => {
          const newFs = JSON.parse(JSON.stringify(prevFs));
          let current = newFs;
          for (const segment of cwd) {
            current = current.children.find((c: any) => c.name === segment);
          }
          current.children.push({ name: args[0], type: 'directory', children: [] });
          return newFs;
        });
        setHistory(prev => [...prev, { type: 'output', content: `Created directory: ${args[0]}` }]);
        break;
      case 'touch':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', content: 'touch: missing operand' }]);
          return;
        }
        const dirToTouch = getDirectory(cwd, fs);
        if (dirToTouch?.children?.find(n => n.name === args[0])) {
          // touch on existing file just updates timestamp, we ignore for now
          setHistory(prev => [...prev, { type: 'output', content: '' }]);
          return;
        }

        setFs(prevFs => {
          const newFs = JSON.parse(JSON.stringify(prevFs));
          let current = newFs;
          for (const segment of cwd) {
            current = current.children.find((c: any) => c.name === segment);
          }
          current.children.push({ name: args[0], type: 'file', content: '' });
          return newFs;
        });
        setHistory(prev => [...prev, { type: 'output', content: `Created file: ${args[0]}` }]);
        break;
      case 'rm':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', content: 'rm: missing operand' }]);
          return;
        }
        const dirToRm = getDirectory(cwd, fs);
        const itemIndex = dirToRm?.children?.findIndex(n => n.name === args[0]);
        
        if (itemIndex === undefined || itemIndex === -1) {
          setHistory(prev => [...prev, { type: 'error', content: `rm: cannot remove '${args[0]}': No such file or directory` }]);
          return;
        }

        setFs(prevFs => {
          const newFs = JSON.parse(JSON.stringify(prevFs));
          let current = newFs;
          for (const segment of cwd) {
            current = current.children.find((c: any) => c.name === segment);
          }
          const index = current.children.findIndex((c: any) => c.name === args[0]);
          if (index !== -1) {
            current.children.splice(index, 1);
          }
          return newFs;
        });
        setHistory(prev => [...prev, { type: 'output', content: `Removed: ${args[0]}` }]);
        break;
      case 'chmod':
        if (!args[1]) { setHistory(prev => [...prev, { type: 'error', content: 'chmod: missing operand' }]); break; }
        setHistory(prev => [...prev, { type: 'output', content: `Permissions changed for ${args[1]}` }]);
        break;
      case 'sudo':
        if (!args[0]) { setHistory(prev => [...prev, { type: 'output', content: 'usage: sudo command' }]); break; }
        setHistory(prev => [...prev, { type: 'output', content: '[sudo] password for learner: ' }]);
        break;
      case 'apt':
        setHistory(prev => [...prev, { type: 'output', content: 'Reading package lists... Done\nBuilding dependency tree... Done\nReading state information... Done' }]);
        break;
      case 'cat':
        if (!args[0]) {
          setHistory(prev => [...prev, { type: 'error', content: 'cat: missing operand' }]);
          break;
        }
        const file = currentDir.children?.find(n => n.name === args[0] && n.type === 'file');
        if (file) {
          setHistory(prev => [...prev, { type: 'output', content: file.content || '' }]);
        } else {
          setHistory(prev => [...prev, { type: 'error', content: `cat: ${args[0]}: No such file` }]);
        }
        break;
      case 'cd':
        if (!args[0] || args[0] === '~') {
          setCwd([]);
        } else if (args[0] === '..') {
          setCwd(prev => prev.slice(0, -1));
        } else {
          const target = currentDir.children?.find(n => n.name === args[0] && n.type === 'directory');
          if (target) {
            setCwd(prev => [...prev, args[0]]);
          } else {
            setHistory(prev => [...prev, { type: 'error', content: `cd: ${args[0]}: No such directory` }]);
          }
        }
        break;
      default:
        setHistory(prev => [...prev, { type: 'error', content: `Command not found: ${cmd}` }]);
    }
  }, [cwd, fs, getDirectory]);

  useEffect(() => {
    if (!runningProcess && (window as any)._activePing) {
      clearInterval((window as any)._activePing);
      delete (window as any)._activePing;
    }
  }, [runningProcess]);

  const handleTabCompletion = useCallback((currentInput: string): string => {
    const parts = currentInput.split(' ');
    const lastPart = parts[parts.length - 1];
    
    const availableCommands = ['ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'rm', 'mv', 'cp', 'clear', 'help', 'whoami', 'df', 'du', 'free', 'ps', 'top', 'grep', 'chmod', 'chown', 'sudo', 'apt', 'systemctl', 'ip', 'ping', 'vim'];
    const currentDir = getDirectory(cwd, fs);
    const files = currentDir?.children?.map(n => n.name) || [];
    
    const suggestions = [...availableCommands, ...files].filter(item => item.startsWith(lastPart));
    
    if (suggestions.length === 1) {
      parts[parts.length - 1] = suggestions[0];
      return parts.join(' ');
    } else if (suggestions.length > 1) {
      // If multiple suggestions, list them in history (similar to real shell)
      setHistory(prev => [...prev, { type: 'output', content: suggestions.join('  ') }]);
    }
    
    return currentInput;
  }, [cwd, fs, getDirectory]);

  const saveFile = useCallback((name: string, content: string) => {
    setFs(prevFs => {
      const newFs = JSON.parse(JSON.stringify(prevFs));
      let current = newFs;
      for (const segment of cwd) {
        current = current.children.find((c: any) => c.name === segment);
      }
      const existing = current.children.find((c: any) => c.name === name);
      if (existing) {
        existing.content = content;
      } else {
        current.children.push({ name, type: 'file', content });
      }
      return newFs;
    });
  }, [cwd]);

  return { 
    history, 
    execute, 
    cwd, 
    handleTabCompletion, 
    interrupt, 
    runningProcess,
    editorMode,
    setEditorMode,
    editorContent,
    setEditorContent,
    editorFileName,
    saveFile
  };
}
