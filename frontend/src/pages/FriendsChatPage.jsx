import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { friendService } from '../services/friendService';
import { chatService } from '../services/chatService';
import { userService } from '../services/userService';

export default function FriendsChatPage() {
  const [friendsData, setFriendsData] = useState({ friends: [], pendingRequests: [] });
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const loadFriends = () => friendService.getFriends().then(setFriendsData);

  useEffect(() => { loadFriends(); }, []);

  useEffect(() => {
    if (selectedFriend) {
      chatService.getPrivate(selectedFriend.id).then(setMessages);
      const interval = setInterval(() => {
        chatService.getPrivate(selectedFriend.id).then(setMessages);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedFriend]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;
    try {
      await chatService.send({ receiverId: selectedFriend.id, content: newMessage });
      setNewMessage('');
      const msgs = await chatService.getPrivate(selectedFriend.id);
      setMessages(msgs);
    } catch {
      toast.error('Failed to send message');
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    const results = await userService.searchUsers(search);
    setSearchResults(results);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Friends & Chat</h1>
      <div className="flex gap-2">
        <input className="input-field max-w-xs" placeholder="Search users..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <button type="button" className="btn-secondary" onClick={handleSearch}>Search</button>
      </div>
      {searchResults.length > 0 && (
        <div className="card">
          {searchResults.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-2">
              <span>{u.fullName || u.username} {u.online ? '🟢' : '⚫'}</span>
              <button type="button" className="btn-primary text-sm"
                onClick={() => friendService.sendRequest(u.id).then(() => { toast.success('Request sent'); loadFriends(); })}>
                Add Friend
              </button>
            </div>
          ))}
        </div>
      )}
      {friendsData.pendingRequests?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold">Pending Requests</h3>
          {friendsData.pendingRequests.map((r) => (
            <div key={r.id} className="flex gap-2 py-2">
              <span>{r.sender?.fullName || r.sender?.username}</span>
              <button type="button" className="btn-primary text-sm"
                onClick={() => friendService.acceptRequest(r.id).then(loadFriends)}>Accept</button>
              <button type="button" className="btn-secondary text-sm"
                onClick={() => friendService.rejectRequest(r.id).then(loadFriends)}>Reject</button>
            </div>
          ))}
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-3 h-[500px]">
        <div className="card overflow-y-auto">
          <h3 className="font-semibold mb-2">Friends</h3>
          {friendsData.friends?.map((f) => (
            <button key={f.id} type="button" onClick={() => setSelectedFriend(f)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm ${selectedFriend?.id === f.id ? 'bg-primary-100 dark:bg-primary-900/40' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {f.fullName || f.username} {f.online ? '🟢' : '⚫'}
            </button>
          ))}
        </div>
        <div className="card lg:col-span-2 flex flex-col">
          {selectedFriend ? (
            <>
              <h3 className="font-semibold border-b pb-2">Chat with {selectedFriend.fullName || selectedFriend.username}</h3>
              <div className="flex-1 overflow-y-auto py-4 space-y-2">
                {messages.map((m) => (
                  <div key={m.id} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    m.sender?.id === selectedFriend.id ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary-100 ml-auto dark:bg-primary-900/40'
                  }`}>
                    <p className="text-xs text-slate-500">{m.sender?.username}</p>
                    <p>{m.content}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 border-t pt-2">
                <input className="input-field" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
                <button type="submit" className="btn-primary">Send</button>
              </form>
            </>
          ) : (
            <p className="text-slate-500 m-auto">Select a friend to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
}
