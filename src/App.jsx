import React, { useState } from 'react';
import { Plus, Eye, CheckCircle, Clock, AlertCircle, Leaf, FileText, X } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

export default function FundRequisitionApp() {
  const [requisitions, setRequisitions] = useState([
    {
      id: 'REQ-2026-001',
      department: 'Facilities',
      purpose: 'Solar Panel Maintenance',
      amount: 5500,
      date: '2026-05-10',
      status: 'Approved',
      approver: 'Maria Castellanos',
      description: 'Q2 maintenance and inspection for rooftop solar array',
      justification: 'Quarterly preventative maintenance ensures optimal energy generation and extends system lifespan by 5+ years.'
    },
    {
      id: 'REQ-2026-002',
      department: 'Housekeeping',
      purpose: 'Eco-Friendly Supplies',
      amount: 2300,
      date: '2026-05-12',
      status: 'Pending',
      approver: 'Awaiting Review',
      description: 'Sustainable cleaning products and organic linens',
      justification: 'Switching to certified eco-friendly products aligns with our carbon-neutral commitment and improves guest satisfaction scores.'
    }
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [formData, setFormData] = useState({
    department: '',
    purpose: '',
    amount: '',
    description: '',
    justification: ''
  });

  const purposes = [
    'Renewable Energy',
    'Solar Panel Maintenance',
    'Water Conservation',
    'Eco-Friendly Supplies',
    'Guest Amenities',
    'Infrastructure Upgrade',
    'Waste Management',
    'Staff Training',
    'Equipment Replacement',
    'Environmental Certification',
    'Other'
  ];

  const departments = [
    'Facilities',
    'Housekeeping',
    'Front Desk',
    'Restaurant',
    'Grounds & Landscaping',
    'Maintenance',
    'Administration',
    'Operations'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.department || !formData.purpose || !formData.amount) {
      alert('Please fill in all required fields (Department, Purpose, Amount)');
      return;
    }

    const newRequisition = {
      id: `REQ-2026-${String(requisitions.length + 1).padStart(3, '0')}`,
      department: formData.department,
      purpose: formData.purpose,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      approver: 'Awaiting Review',
      description: formData.description,
      justification: formData.justification
    };

    setRequisitions([newRequisition, ...requisitions]);
    setFormData({ department: '', purpose: '', amount: '', description: '', justification: '' });
    setFormOpen(false);
  };

  const deleteRequisition = (id) => {
    setRequisitions(requisitions.filter(r => r.id !== id));
    setSelectedRequisition(null);
  };

  const updateStatus = (id, newStatus) => {
    setRequisitions(requisitions.map(r => 
      r.id === id ? { ...r, status: newStatus, approver: newStatus === 'Pending' ? 'Awaiting Review' : 'Admin Review' } : r
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'text-emerald-600 bg-emerald-50';
      case 'Pending': return 'text-amber-600 bg-amber-50';
      case 'Rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalRequested = requisitions.reduce((sum, r) => sum + r.amount, 0);
  const approvedAmount = requisitions.filter(r => r.status === 'Approved').reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = requisitions.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f9f7 0%, #f0f8f4 100%)' }}>
      <header className="border-b border-emerald-100 bg-white/70 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Novem Eco Resort</h1>
                <p className="text-sm text-emerald-600 font-medium">Fund Requisition System</p>
              </div>
            </div>
            <button
              onClick={() => setFormOpen(!formOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 font-medium"
            >
              <Plus className="w-4 h-4" />
              New Requisition
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-emerald-100 shadow-sm">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Total Requested</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalRequested.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-emerald-100 shadow-sm">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Approved</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">${approvedAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-emerald-100 shadow-sm">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Pending (${pendingAmount.toLocaleString()})</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{requisitions.filter(r => r.status === 'Pending').length} requests</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {formOpen && (
          <div className="mb-8 bg-white rounded-xl border border-emerald-200 shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">Submit New Fund Requisition</h2>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose *</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select Purpose</option>
                    {purposes.map(purpose => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Requested ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brief Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Q2 maintenance and supplies"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Justification & Details</label>
                <textarea
                  value={formData.justification}
                  onChange={(e) => setFormData({...formData, justification: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Explain the business need and environmental impact..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Submit Requisition
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Requisition History</h2>
          <div className="space-y-3">
            {requisitions.map(req => (
              <div key={req.id} className="bg-white rounded-lg border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded">{req.id}</span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                          {getStatusIcon(req.status)}
                          {req.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900">{req.purpose}</h3>
                      <p className="text-sm text-gray-600 mt-1">{req.department} • {new Date(req.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">${req.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Approver: {req.approver}</p>
                    </div>
                  </div>

                  {req.description && (
                    <p className="text-sm text-gray-700 mb-3">{req.description}</p>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedRequisition(selectedRequisition?.id === req.id ? null : req)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      {selectedRequisition?.id === req.id ? 'Hide' : 'View'} Details
                    </button>
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(req.id, 'Approved')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, 'Rejected')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          ✕ Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteRequisition(req.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
                    >
                      Delete
                    </button>
                  </div>

                  {selectedRequisition?.id === req.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                        <p className="font-semibold mb-2">Justification:</p>
                        <p>{req.justification || 'No additional details provided.'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-emerald-100 bg-white/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-600">
          <p>Novem Eco Resort • Fund Requisition System • Internal Use Only</p>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}
