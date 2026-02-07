const DashboardCard = ({ title, value, icon: Icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    blue: 'bg-blue-500 text-white',
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-xs md:text-sm font-medium">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">{value}</p>
        </div>
        {Icon && (
          <div className={`${colorClasses[color]} p-2 md:p-3 rounded-lg`}>
            <Icon size={20} className="md:w-6 md:h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardCard
