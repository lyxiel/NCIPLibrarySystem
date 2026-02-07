const StatusBadge = ({ status }) => {
  const statusStyles = {
    Available: 'bg-green-100 text-green-800',
    Borrowed: 'bg-blue-100 text-blue-800',
    Reserved: 'bg-orange-100 text-orange-800',
    Returned: 'bg-green-100 text-green-800',
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Published: 'bg-green-100 text-green-800',
    Draft: 'bg-yellow-100 text-yellow-800',
  }

  const style = statusStyles[status] || 'bg-gray-100 text-gray-800'

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      {status}
    </span>
  )
}

export default StatusBadge
