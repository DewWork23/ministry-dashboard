import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Users, Phone, Mail, MessageSquare, Clock, ChevronDown, Filter } from 'lucide-react';
import PropTypes from 'prop-types';

const ContactManagement = ({ data = [] }) => {
  // Process contact data
  const contacts = data.map(item => ({
    name: item.Contact || 'No Contact Listed',
    church: item.Church,
    role: 'Contact', // You might want to add Role to your sheet
    lastContact: item['Visit Date'],
    status: getContactStatus(item),
    email: 'email@example.com', // You might want to add Email to your sheet
    phone: 'phone number', // You might want to add Phone to your sheet
    recentInteractions: item['Visit Notes'] ? [
      {
        type: 'visit',
        date: item['Visit Date'],
        notes: item['Visit Notes']
      }
    ] : []
  })).filter(contact => contact.name !== 'No Contact Listed');

  function getContactStatus(item) {
    if (!item['Visit Date']) return 'waiting-response';
    if (item['Visit?'] === 'Yes') return 'responsive';
    return 'follow-up-needed';
  }

  const statusColors = {
    'responsive': 'bg-green-100 text-green-800',
    'follow-up-needed': 'bg-yellow-100 text-yellow-800',
    'waiting-response': 'bg-blue-100 text-blue-800'
  };

  const getInteractionIcon = (type) => {
    switch(type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'visit': return <Users className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Calculate quick stats
  const stats = {
    total: contacts.length,
    active: contacts.filter(c => c.status === 'responsive').length,
    needFollowUp: contacts.filter(c => c.status === 'follow-up-needed').length,
    newThisWeek: contacts.filter(c => {
      if (!c.lastContact) return false;
      const contactDate = new Date(c.lastContact);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return contactDate >= weekAgo;
    }).length
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <CardTitle>Contact Management</CardTitle>
            </div>
            <button className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600">Total</div>
              <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600">Active</div>
              <div className="text-2xl font-bold text-green-700">{stats.active}</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-sm text-yellow-600">Need Follow-up</div>
              <div className="text-2xl font-bold text-yellow-700">{stats.needFollowUp}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600">New This Week</div>
              <div className="text-2xl font-bold text-purple-700">{stats.newThisWeek}</div>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.role} at {contact.church}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${statusColors[contact.status]}`}>
                    {contact.status.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>
                
                {contact.recentInteractions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Recent Interactions</h4>
                    <div className="space-y-2">
                      {contact.recentInteractions.map((interaction, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="mt-1">{getInteractionIcon(interaction.type)}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                              </span>
                              <span className="text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(interaction.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600">{interaction.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More */}
          <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2">
            View More Contacts
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

ContactManagement.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Contact: PropTypes.string,
      Church: PropTypes.string,
      'Visit Date': PropTypes.string,
      'Visit?': PropTypes.string,
      'Visit Notes': PropTypes.string,
    })
  )
};

ContactManagement.defaultProps = {
  data: []
};

export default ContactManagement;