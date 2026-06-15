import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { chatService } from '../services/chatService';

export default function GroupDiscussionPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });

  const loadGroups = () => chatService.getGroups().then(setGroups);

  useEffect(() => { loadGroups(); }, []);

  useEffect(() => {
    if (selectedGroup) {
      chatService.getGroup(selectedGroup.id).then(setMessages);
      const interval = setInterval(() => {
        chatService.getGroup(selectedGroup.id).then(setMessages);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup]);

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      await chatService.createGroup(newGroup);
      setNewGroup({ name: '', description: '' });
      loadGroups();
      toast.success('Group created!');
    } catch {
      toast.error('Failed to create group');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGroup) return;
    try {
      await chatService.send({ groupId: selectedGroup.id, content: newMessage });
      setNewMessage('');
      setMessages(await chatService.getGroup(selectedGroup.id));
    } catch {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Discussion Groups</h1>
      <form onSubmit={createGroup} className="card flex flex-wrap gap-2">
        <input className="input-field max-w-xs" placeholder="Group name" value={newGroup.name}
          onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} required />
        <input className="input-field max-w-xs" placeholder="Description" value={newGroup.description}
          onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} />
        <button type="submit" className="btn-primary">Create Group</button>
      </form>
      <div className="grid gap-4 lg:grid-cols-3 h-[500px]">
        <div className="card overflow-y-auto">
          {groups.map((g) => (
            <button key={g.id} type="button" onClick={() => setSelectedGroup(g)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm mb-1 ${selectedGroup?.id === g.id ? 'bg-primary-100' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <p className="font-medium">{g.name}</p>
              <p className="text-xs text-slate-500">{g.description}</p>
            </button>
          ))}
          {groups.length === 0 && <p className="text-sm text-slate-500">No groups yet. Create one!</p>}
          {groups.map((g) => (
            <button key={`join-${g.id}`} type="button" className="text-xs text-primary-600 block w-full text-left mt-1"
              onClick={() => chatService.joinGroup(g.id).then(() => { toast.success('Joined group'); loadGroups(); })}>
              + Join {g.name}
            </button>
          ))}
        </div>
        <div className="card lg:col-span-2 flex flex-col">
          {selectedGroup ? (
            <>
              <h3 className="font-semibold border-b pb-2">{selectedGroup.name}</h3>
              <div className="flex-1 overflow-y-auto py-4 space-y-2">
                {messages.map((m) => (
                  <div key={m.id} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <p className="text-xs font-medium text-primary-600">{m.sender?.username}</p>
                    <p className="text-sm">{m.content}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 border-t pt-2">
                <input className="input-field" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit" className="btn-primary">Send</button>
              </form>
            </>
          ) : (
            <p className="text-slate-500 m-auto">Select a group to join the discussion</p>
          )}
        </div>
      </div>
    </div>
  );
}
