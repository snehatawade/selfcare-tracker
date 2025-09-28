import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { DailyLog } from '../types';
import { 
  Droplets, 
  Moon, 
  Activity, 
  Brain, 
  Smile,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTodayLog();
      fetchWeeklyStats();
    }
  }, [user]);

  const fetchTodayLog = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching today log:', error);
    } else if (data) {
      setTodayLog(data);
    }
  };

  const fetchWeeklyStats = async () => {
    if (!user) return;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', oneWeekAgo.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching weekly stats:', error);
    } else {
      setWeeklyStats(data || []);
    }
    
    setLoading(false);
  };

  const getWeeklyAverage = (field: keyof DailyLog) => {
    if (weeklyStats.length === 0) return 0;
    const sum = weeklyStats.reduce((acc, log) => acc + (log[field] as number || 0), 0);
    return Math.round(sum / weeklyStats.length);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name}!
        </h1>
        <p className="text-gray-600">Here's how your wellness journey is going</p>
      </div>

      {/* Today's Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {todayLog ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{todayLog.water_intake}</p>
              <p className="text-sm text-blue-600">glasses</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <Moon className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700">{todayLog.sleep_hours}h</p>
              <p className="text-sm text-purple-600">sleep</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{todayLog.exercise_minutes}</p>
              <p className="text-sm text-green-600">min exercise</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <Brain className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-700">{todayLog.meditation_minutes}</p>
              <p className="text-sm text-orange-600">min meditation</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <Smile className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl">{getMoodEmoji(todayLog.mood)}</p>
              <p className="text-sm text-yellow-600 capitalize">{todayLog.mood}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No log entry for today yet</p>
            <p className="text-sm text-gray-400">Add your first entry to start tracking!</p>
          </div>
        )}
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">7-Day Averages</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>{weeklyStats.length} entries</span>
          </div>
        </div>

        {weeklyStats.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{getWeeklyAverage('water_intake')}</p>
              <p className="text-sm text-blue-600">avg glasses/day</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <Moon className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700">{getWeeklyAverage('sleep_hours')}h</p>
              <p className="text-sm text-purple-600">avg sleep/day</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{getWeeklyAverage('exercise_minutes')}</p>
              <p className="text-sm text-green-600">avg min/day</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <Brain className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-700">{getWeeklyAverage('meditation_minutes')}</p>
              <p className="text-sm text-orange-600">avg min/day</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No data available for weekly overview</p>
          </div>
        )}
      </div>
    </div>
  );
};