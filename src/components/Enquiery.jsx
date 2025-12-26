import React, { useEffect, useState, useCallback } from 'react';
import { FiMail, FiPhone, FiArrowUpRight, FiMessageSquare, FiClock, FiCheckCircle, FiX } from 'react-icons/fi';
import { api } from '../services/api';

const priorityColor = {
  High: 'bg-rose-50 text-rose-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-gray-100 text-gray-700',
};

const Enquiery = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [channel, setChannel] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getEnquiries({ status, priority, channel, search, limit: 50 });
      setEnquiries(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, priority, channel, search]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Inbox</p>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-gray-500">Fast triage with clear priority labels.</p>
        </div>
        <button
          onClick={fetchEnquiries}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition"
        >
          <FiArrowUpRight />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, topic"
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All status</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All channels</option>
          <option value="Email">Email</option>
          <option value="Call">Call</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Website">Website</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {error && <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>}

      <div className="grid gap-4 md:grid-cols-3">
        {loading && <div className="p-4 border border-gray-200 rounded-2xl bg-white text-sm text-gray-500">Loading...</div>}
        {!loading && enquiries.length === 0 && (
          <div className="p-4 border border-gray-200 rounded-2xl bg-white text-sm text-gray-500">No enquiries found</div>
        )}
        {!loading &&
          enquiries.map((item) => (
            <div 
              key={item._id || item.name} 
              className="p-4 border border-gray-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedEnquiry(item)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor[item.priority] || 'bg-gray-100 text-gray-700'}`}
                >
                  {item.priority} priority
                </span>
              </div>
              
              <div className="space-y-2 mb-3">
                <p className="text-sm font-medium text-gray-900">{item.topic}</p>
                
                {item.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="text-gray-400" />
                    <span className="truncate">{item.email}</span>
                  </div>
                )}
                
                {item.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiPhone className="text-gray-400" />
                    <span>{item.phone}</span>
                  </div>
                )}
                
                {item.message && (
                  <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className="inline-flex items-center gap-2">
                  {item.channel === 'Email' ? <FiMail /> : <FiPhone />}
                  {item.channel}
                </span>
                {item.sla && (
                  <span className="text-xs text-gray-500">SLA: {item.sla}</span>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    item.status === 'New' ? 'bg-blue-500' :
                    item.status === 'In Progress' ? 'bg-yellow-500' :
                    item.status === 'Resolved' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`}></span>
                  {item.status}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="text-gray-400" />
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
              
              {item.response && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FiCheckCircle className="text-green-500" />
                    Response added
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedEnquiry(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedEnquiry.name}</h3>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${priorityColor[selectedEnquiry.priority] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {selectedEnquiry.priority} priority
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedEnquiry.status}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                {selectedEnquiry.email && (
                  <div className="flex items-start gap-3">
                    <FiMail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a href={`mailto:${selectedEnquiry.email}`} className="text-sm text-indigo-600 hover:underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedEnquiry.phone && (
                  <div className="flex items-start gap-3">
                    <FiPhone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <a href={`tel:${selectedEnquiry.phone}`} className="text-sm text-indigo-600 hover:underline">
                        {selectedEnquiry.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Topic */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Topic</p>
                <p className="text-base font-medium text-gray-900">{selectedEnquiry.topic}</p>
              </div>

              {/* Message */}
              {selectedEnquiry.message && (
                <div>
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                    <FiMessageSquare className="w-4 h-4" />
                    Message
                  </p>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                  </div>
                </div>
              )}

              {/* Response */}
              {selectedEnquiry.response && (
                <div>
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-green-500" />
                    Response
                  </p>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEnquiry.response}</p>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Channel</p>
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    {selectedEnquiry.channel === 'Email' ? <FiMail /> : <FiPhone />}
                    {selectedEnquiry.channel}
                  </p>
                </div>
                
                {selectedEnquiry.sla && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">SLA</p>
                    <p className="text-sm text-gray-900">{selectedEnquiry.sla}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="text-sm text-gray-900 flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    {selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleString() : '—'}
                  </p>
                </div>
                
                {selectedEnquiry.resolvedAt && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Resolved</p>
                    <p className="text-sm text-gray-900 flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-green-500" />
                      {new Date(selectedEnquiry.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                
                {selectedEnquiry.updatedAt && selectedEnquiry.updatedAt !== selectedEnquiry.createdAt && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedEnquiry.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiery;

