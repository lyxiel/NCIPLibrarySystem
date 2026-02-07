import { BookOpen, Users, Archive, AlertCircle } from 'lucide-react'

const ActivityLog = ({ activities }) => {
  const getIcon = (type) => {
    const icons = {
      borrow: BookOpen,
      return: BookOpen,
      member: Users,
      reserve: BookOpen,
      book: Archive,
    }
    return icons[type] || AlertCircle
  }

  const getColor = (type) => {
    const colors = {
      borrow: 'text-blue-500',
      return: 'text-green-500',
      member: 'text-purple-500',
      reserve: 'text-orange-500',
      book: 'text-indigo-500',
    }
    return colors[type] || 'text-gray-500'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type)
          const colorClass = getColor(activity.type)

          return (
            <div key={activity.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
              <div className={`${colorClass} flex-shrink-0 mt-1`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{activity.action}</p>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ActivityLog
