import React, { useState, useEffect } from 'react';
import { Save, Building, Phone, Mail, Clock, MapPin, DollarSign, Bike, Power, Store } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import api from '../../utils/api';

const GeneralSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [togglingStatus, setTogglingStatus] = useState(false);
    const { socket } = useSocket();
    const [settings, setSettings] = useState({
        // Default structure
        isStoreActive: true,
        contactPhone: '',
        contactEmail: '',
        address: '',
        deliveryCharge: 20,
        maxDeliveryDistance: 10,
        minOrderAmount: 100,
        taxRate: 5,
        gstRate: 5,
        riderBaseEarning: 30,
        distanceBonusPerKm: 5,
        operatingHours: {
            monday: { open: '09:00', close: '22:00', isOpen: true },
            tuesday: { open: '09:00', close: '22:00', isOpen: true },
            wednesday: { open: '09:00', close: '22:00', isOpen: true },
            thursday: { open: '09:00', close: '22:00', isOpen: true },
            friday: { open: '09:00', close: '22:00', isOpen: true },
            saturday: { open: '09:00', close: '23:00', isOpen: true },
            sunday: { open: '09:00', close: '23:00', isOpen: true }
        },
        socialMedia: { facebook: '', instagram: '', twitter: '' }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handleUpdate = () => {
            fetchSettings();
        };
        socket.on('settings:updated', handleUpdate);
        return () => {
            socket.off('settings:updated', handleUpdate);
        };
    }, [socket]);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            if (response.data.success) {
                // Merge with defaults to ensure all fields exist
                setSettings(prev => ({ ...prev, ...response.data.data }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Handle nested properties (e.g. socialMedia.facebook) handled separately if needed, 
        // but explicit flat fields are easier. 
        // For simple top levels:
        setSettings(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleNestedChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleHoursChange = (day, field, value) => {
        setSettings(prev => ({
            ...prev,
            operatingHours: {
                ...prev.operatingHours,
                [day]: {
                    ...prev.operatingHours[day],
                    [field]: value
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.put('/admin/settings', settings);
            if (response.data.success) {
                alert('Settings updated successfully!');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStoreStatus = async () => {
        const currentActive = settings.isStoreActive !== false;
        const newStatus = !currentActive;
        setTogglingStatus(true);
        try {
            const response = await api.put('/admin/settings', { isStoreActive: newStatus });
            if (response.data.success) {
                setSettings(prev => ({ ...prev, isStoreActive: newStatus }));
            }
        } catch (error) {
            console.error('Error toggling storefront status:', error);
            alert('Failed to update storefront status');
        } finally {
            setTogglingStatus(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    const isLittleHActive = settings.isStoreActive !== false;

    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl mx-auto pb-20">
            {/* Storefront Visibility & Ordering Toggle */}
            <div className={`rounded-[2.5rem] p-8 border transition-all duration-300 ${
                isLittleHActive 
                    ? 'bg-gradient-to-r from-emerald-50/70 to-teal-50/70 border-emerald-200 shadow-sm' 
                    : 'bg-gradient-to-r from-rose-50/70 to-amber-50/70 border-rose-200 shadow-sm'
            }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-colors ${
                            isLittleHActive
                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20'
                                : 'bg-rose-500 text-white border-rose-400 shadow-rose-500/20'
                        }`}>
                            <Power className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                    Customer App Storefront
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                    isLittleHActive
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                }`}>
                                    {isLittleHActive ? '🟢 ONLINE & ACTIVE' : '🔴 OFFLINE / HIDDEN'}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-gray-600 mt-1 max-w-xl">
                                {isLittleHActive
                                    ? 'Little H is visible to customers on the customer app and accepting orders.'
                                    : 'Little H is turned OFF and hidden from the customer app. Any customer visiting /littleh will be automatically redirected to Teas N Trees.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={togglingStatus}
                        onClick={handleToggleStoreStatus}
                        className={`relative inline-flex h-11 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isLittleHActive 
                                ? 'bg-emerald-600 focus:ring-emerald-500' 
                                : 'bg-gray-300 focus:ring-gray-400'
                        } ${togglingStatus ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <span className="sr-only">Toggle Little H Storefront</span>
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-10 w-10 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                                isLittleHActive ? 'translate-x-9' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>
            </div>

            {/* Store Information */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                            <Building className="w-6 h-6 text-bakery-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Store Info</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Basic Details</p>
                        </div>
                    </div>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="col-span-2 space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Store Address</label>
                        <textarea
                            name="address"
                            rows="3"
                            value={settings.address || ''}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-bakery-primary focus:border-bakery-primary transition-all font-black text-sm uppercase"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="w-4 h-4 text-gray-400 absolute left-6 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                name="contactPhone"
                                value={settings.contactPhone || ''}
                                onChange={handleChange}
                                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-bakery-primary focus:border-bakery-primary transition-all font-black text-sm uppercase"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Email Address</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-6 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail || ''}
                                onChange={handleChange}
                                className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-bakery-primary focus:border-bakery-primary transition-all font-black text-sm uppercase"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Fees & Taxes */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                            <DollarSign className="w-6 h-6 text-bakery-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Taxes & Fees</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Charges & Rates</p>
                        </div>
                    </div>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Delivery Fee (₹)</label>
                        <input
                            type="number"
                            name="deliveryCharge"
                            value={settings.deliveryCharge}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-[1.2rem] border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-bakery-primary focus:border-bakery-primary transition-all font-black text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">GST Rate (%)</label>
                        <input
                            type="number"
                            name="gstRate"
                            value={settings.gstRate}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-[1.2rem] border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-black text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Min Order (₹)</label>
                        <input
                            type="number"
                            name="minOrderAmount"
                            value={settings.minOrderAmount}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-[1.2rem] border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-black text-sm"
                        />
                    </div>
                    <div className="col-span-full md:col-span-2 space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Max Delivery Range (KM)</label>
                        <input
                            type="number"
                            name="maxDeliveryDistance"
                            value={settings.maxDeliveryDistance}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-[1.2rem] border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-black text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Rider Earnings */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                            <Bike className="w-6 h-6 text-bakery-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Rider Earnings</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Pay Structure</p>
                        </div>
                    </div>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Base Pay (₹)</label>
                        <input
                            type="number"
                            name="riderBaseEarning"
                            value={settings.riderBaseEarning}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-black text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Distance Bonus (₹/KM)</label>
                        <input
                            type="number"
                            name="distanceBonusPerKm"
                            value={settings.distanceBonusPerKm}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-black text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                            <Clock className="w-6 h-6 text-bakery-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Opening Hours</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Store Schedule</p>
                        </div>
                    </div>
                </div>
                <div className="p-10">
                    <div className="space-y-4">
                        {Object.entries(settings.operatingHours || {}).map(([day, hours]) => (
                            <div key={day} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                                <div className="w-32 font-black uppercase text-[10px] text-gray-400 tracking-widest">{day}</div>
                                <div className="flex-1 flex items-center gap-4">
                                    <input
                                        type="time"
                                        value={hours.open}
                                        onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                        className="px-4 py-2 rounded-xl border border-gray-100 font-black text-xs focus:ring-2 focus:ring-bakery-primary focus:border-bakery-primary outline-none transition-all uppercase"
                                    />
                                    <span className="text-[10px] font-black text-gray-300 uppercase">{"->"}</span>
                                    <input
                                        type="time"
                                        value={hours.close}
                                        onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                        className="px-4 py-2 rounded-xl border border-gray-100 font-black text-xs focus:ring-2 focus:ring-bakery-primary focus:border-bakery-primary outline-none transition-all uppercase"
                                    />
                                    <label className="flex items-center gap-3 ml-6 cursor-pointer group/label">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={hours.isOpen}
                                                onChange={(e) => handleHoursChange(day, 'isOpen', e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-10 h-6 rounded-full transition-all border ${hours.isOpen ? 'bg-bakery-primary border-bakery-primary' : 'bg-gray-100 border-gray-200'}`}>
                                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all transform ${hours.isOpen ? 'translate-x-4' : ''}`}></div>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${hours.isOpen ? 'text-bakery-primary' : 'text-gray-400'}`}>
                                            {hours.isOpen ? 'Active' : 'Offline'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end sticky bottom-10 z-20">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-3 px-12 py-5 bg-bakery-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-bakery-primary transition-all shadow-2xl shadow-bakery-light disabled:opacity-50 hover:scale-105 active:scale-95"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Synchronizing...' : 'Commit Settings'}
                </button>
            </div>
        </form>
    );
};

export default GeneralSettings;
