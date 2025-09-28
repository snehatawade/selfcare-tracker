import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { DailyLog } from '../types';
import { Droplets, Moon, Activity, Brain, Smile, Calendar, Trash2, CreditCard as Edit } from 'lucide-react';

interface HistoryProps {
  onEditLog: (log: DailyLog) => void;
}

export const History: React.FC<HistoryProps> = ({ onEditLog }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error);
    } else {
      setLogs(data || []);
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) {
      return;
    }

    const { error } = await supabase
      .from('daily_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting log:', error);
    } else {
      setLogs(logs.filter(log => log.id !== id));
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excellent': return '😊';
      case 'good': return '🙂';
      case 'okay': return '😐';
      case 'stressed': return '😰';
      case 'sad': return '😢';
      default: return '😐';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wellness History</h1>
        <p className="text-gray-600">Track your progress over time</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No logs yet</h3>
          <p className="text-gray-500">Start by adding your first daily log entry!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDate(log.date)}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditLog(log)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit log"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-blue-700">{log.water_intake}</p>
                  <p className="text-xs text-blue-600">glasses</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <Moon className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-purple-700">{log.sleep_hours}h</p>
                  <p className="text-xs text-purple-600">sleep</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <Activity className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-green-700">{log.exercise_minutes}</p>
                  <p className="text-xs text-green-600">min</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <Brain className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-orange-700">{log.meditation_minutes}</p>
                  <p className="text-xs text-orange-600">min</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-center">
                  <Smile className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                  <p className="text-lg">{getMoodEmoji(log.mood)}</p>
                  <p className="text-xs text-yellow-600 capitalize">{log.mood}</p>
                </div>
              </div>

              {log.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 italic">{log.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};