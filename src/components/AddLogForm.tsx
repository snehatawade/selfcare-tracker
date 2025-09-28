import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { DailyLog } from '../types';
import { Droplets, Moon, Activity, Brain, Smile, Save, CreditCard as Edit, Calendar } from 'lucide-react';

export const AddLogForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [existingLog, setExistingLog] = useState<DailyLog | null>(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    water_intake: 0,
    sleep_hours: 0,
    exercise_minutes: 0,
    meditation_minutes: 0,
    mood: 'okay' as const,
    notes: '',
  });

  useEffect(() => {
    if (user && formData.date) {
      checkExistingLog();
    }
  }, [user, formData.date]);

  const checkExistingLog = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', formData.date)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking existing log:', error);
    } else if (data) {
      setExistingLog(data);
      setFormData({
        date: data.date,
        water_intake: data.water_intake,
        sleep_hours: data.sleep_hours,
        exercise_minutes: data.exercise_minutes,
        meditation_minutes: data.meditation_minutes,
        mood: data.mood,
        notes: data.notes || '',
      });
    } else {
      setExistingLog(null);
      setFormData(prev => ({
        ...prev,
        water_intake: 0,
        sleep_hours: 0,
        exercise_minutes: 0,
        meditation_minutes: 0,
        mood: 'okay',
        notes: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');

    try {
      const logData = {
        user_id: user.id,
        date: formData.date,
        water_intake: formData.water_intake,
        sleep_hours: formData.sleep_hours,
        exercise_minutes: formData.exercise_minutes,
        meditation_minutes: formData.meditation_minutes,
        mood: formData.mood,
        notes: formData.notes,
      };

      let error;
      if (existingLog) {
        const { error: updateError } = await supabase
          .from('daily_logs')
          .update(logData)
          .eq('id', existingLog.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('daily_logs')
          .insert(logData);
        error = insertError;
      }

      if (error) throw error;

      setMessage(existingLog ? 'Log updated successfully!' : 'Log saved successfully!');
      
      // Refresh existing log data
      await checkExistingLog();
    } catch (error: any) {
      setMessage('Error saving log: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const moodOptions = [
    { value: 'excellent', label: 'Excellent', emoji: '😊' },
    { value: 'good', label: 'Good', emoji: '🙂' },
    { value: 'okay', label: 'Okay', emoji: '😐' },
    { value: 'stressed', label: 'Stressed', emoji: '😰' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {existingLog ? 'Update Your Log' : 'Add Daily Log'}
          </h1>
          <p className="text-gray-600">Track your wellness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {existingLog && (
              <p className="mt-1 text-sm text-amber-600 flex items-center">
                <Edit className="w-4 h-4 mr-1" />
                Editing existing log for this date
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Water Intake */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Droplets className="inline w-4 h-4 mr-1" />
                Water Intake (glasses)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.water_intake}
                onChange={(e) => setFormData({ ...formData, water_intake: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="8"
              />
            </div>

            {/* Sleep Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Moon className="inline w-4 h-4 mr-1" />
                Sleep Hours
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.sleep_hours}
                onChange={(e) => setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="8"
              />
            </div>

            {/* Exercise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="inline w-4 h-4 mr-1" />
                Exercise (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="1440"
                value={formData.exercise_minutes}
                onChange={(e) => setFormData({ ...formData, exercise_minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="30"
              />
            </div>

            {/* Meditation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Brain className="inline w-4 h-4 mr-1" />
                Meditation (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="1440"
                value={formData.meditation_minutes}
                onChange={(e) => setFormData({ ...formData, meditation_minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="10"
              />
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Smile className="inline w-4 h-4 mr-1" />
              How are you feeling?
            </label>
            <div className="grid grid-cols-5 gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: option.value as any })}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    formData.mood === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs font-medium text-gray-700">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="How was your day? Any thoughts or reflections..."
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : (existingLog ? 'Update Log' : 'Save Log')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};