const StatusBadge = ({ status }) => {
  const statusStyles = {
    Available: 'badge-available',
    Borrowed: 'badge-borrowed',
    Reserved: 'badge-restricted',
    Restricted: 'badge-restricted',
    Returned: 'badge-available',
    Active: 'badge-available',
    Inactive: 'bg-gray-50 text-gray-700 border border-gray-300',
    Published: 'badge-available',
    Draft: 'bg-yellow-50 text-yellow-700 border border-yellow-300',
    IKSP: 'badge-iksp',
    CL: 'badge-cl',
    Public: 'badge-available',
    Restricted: 'badge-restricted',
    Sacred: 'badge-restricted',
  }

  const style = statusStyles[status] || 'bg-gray-50 text-gray-700 border border-gray-300'

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth ${style}`}>
      {status}
    </span>
  )
}

export default StatusBadge
