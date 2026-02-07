const StatusBadge = ({ status }) => {
  const statusStyles = {
    Available: 'bg-green-500 text-white',
    Borrowed: 'bg-orange-500 text-white',
    Reserved: 'bg-red-500 text-white',
    Restricted: 'bg-red-500 text-white',
    Returned: 'bg-green-500 text-white',
    Active: 'bg-green-500 text-white',
    Inactive: 'bg-gray-500 text-white',
    Published: 'bg-green-500 text-white',
    Draft: 'bg-yellow-500 text-black',
    IKSP: 'bg-purple-500 text-white',
    CL: 'bg-yellow-500 text-black',
    Public: 'bg-green-500 text-white',
    Sacred: 'bg-red-500 text-white',
  }

  const style = statusStyles[status] || 'bg-gray-500 text-white'

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth ${style}`}>
      {status}
    </span>
  )
}

export default StatusBadge
