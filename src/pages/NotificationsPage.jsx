import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import Icon from '../components/common/Icon'

const iconFor = {
  like: 'heart',
  comment: 'message',
  reply: 'message',
  follow: 'users',
  system: 'bell',
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [markingAll, setMarkingAll] = useState(false)

  const load = useCallback(async () => {
    if (!user) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const { data: rows, error: fetchError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setData(rows || [])
    }

    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    load()

    if (!user) return undefined

    const channel = supabase
      .channel(`notifications-page-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        ({ new: notification }) => {
          setData((current) => [notification, ...current].slice(0, 100))
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        ({ new: notification }) => {
          setData((current) =>
            current.map((item) =>
              item.id === notification.id ? notification : item
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load, user?.id])

  async function markAll() {
    if (!user || markingAll) return

    setMarkingAll(true)

    const { error: updateError } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (updateError) {
      setError(updateError.message)
    } else {
      setData((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      )
    }

    setMarkingAll(false)
  }

  async function open(notification) {
    if (!notification.is_read) {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id)
        .eq('user_id', user.id)

      if (!updateError) {
        setData((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, is_read: true }
              : item
          )
        )
      }
    }

    if (notification.link) nav(notification.link)
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-xl py-20 text-center">
          <Icon name="bell" size={28} className="mx-auto text-[#ff4655]" />
          <h1 className="mt-4 font-display text-2xl font-black uppercase text-white">
            Sign in to see notifications
          </h1>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-[.25em] text-[#00e5ff]">
              ACTIVITY CENTER
            </p>
            <h1 className="mt-1 font-display text-3xl font-black uppercase text-white">
              Notifications
            </h1>
          </div>

          <button
            type="button"
            onClick={markAll}
            disabled={markingAll || !data.some((item) => !item.is_read)}
            className="rounded-xl border border-white/10 px-3 py-2 text-[10px] font-black uppercase text-neutral-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {markingAll ? 'Marking…' : 'Mark all read'}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/5 p-3 text-xs text-[#ff6674]">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-2">
          {loading && (
            <div className="space-y-2" role="status" aria-label="Loading notifications">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-2xl border border-white/[.06] bg-white/[.02]" />
              ))}
            </div>
          )}

          {!loading && !data.length && (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <Icon name="bell" size={25} className="mx-auto text-neutral-700" />
              <p className="mt-3 text-sm text-neutral-600">
                You're all caught up.
              </p>
            </div>
          )}

          {!loading && data.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => open(notification)}
              className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition hover:border-white/15 ${
                notification.is_read
                  ? 'border-white/[.06] bg-[#0d0d12]'
                  : 'border-[#ff4655]/20 bg-[#ff4655]/[.045]'
              }`}
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  notification.is_read
                    ? 'bg-white/[.04] text-neutral-600'
                    : 'bg-[#ff4655]/10 text-[#ff6674]'
                }`}
              >
                <Icon name={iconFor[notification.type] || 'bell'} size={16} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-bold text-white">
                  {notification.title || 'Community activity'}
                </span>
                <span className="mt-1 block text-sm leading-6 text-neutral-400">
                  {notification.body}
                </span>
                <span className="mt-2 block text-[10px] text-neutral-600">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </span>

              {!notification.is_read && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff4655]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
