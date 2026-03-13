import { useState, useEffect, useRef } from 'react';
import { notificationAPI } from '../../utils/api';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const load = async () => {
    try {
      const res = await notificationAPI.getAll({ limit: 8 });
      setNotifications(res.data.notifications || []);
      setUnread(res.data.unreadCount || 0);
    } catch {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markRead = async () => {
    await notificationAPI.markAllRead();
    setUnread(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const typeColors = {
    report_approved: 'var(--green)', report_rejected: 'var(--red)',
    certificate_verified: 'var(--green)', certificate_rejected: 'var(--red)',
    internship_approved: 'var(--cyan)', system: 'var(--violet2)',
    report_submitted: 'var(--amber)',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn btn-ghost btn-icon"
        onClick={() => { setOpen(o => !o); if (!open && unread > 0) markRead(); }}
        style={{ position: 'relative', fontSize: 18 }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4, width: 16, height: 16,
            background: 'var(--red)', borderRadius: '50%', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 8,
          width: 340, background: 'var(--bg1)', border: '1px solid var(--border2)',
          borderRadius: 16, overflow: 'hidden', zIndex: 200,
          boxShadow: '0 20px 60px rgba(0,0,0,.5)',
          animation: 'fadeUp .2s ease',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15 }}>Notifications</span>
            {unread > 0 && (
              <button onClick={markRead} style={{ fontSize: 12, color: 'var(--cyan)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>No notifications</div>
            ) : (
              notifications.map(n => (
                <div key={n._id} style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: n.isRead ? 'transparent' : 'rgba(0,229,255,.03)',
                  cursor: 'pointer',
                  transition: 'background .15s',
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[n.type] || 'var(--text3)', marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
