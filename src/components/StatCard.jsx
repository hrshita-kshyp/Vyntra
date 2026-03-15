
const StatCard = ({ title, value, goal, status, icon, color = 'indigo', trend, trendValue, pulse = false }) => {
    const colors = {
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', iconBg: 'bg-indigo-50' },
        red: { bg: 'bg-red-100', text: 'text-red-600', iconBg: 'bg-red-50' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', iconBg: 'bg-orange-50' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-50' },
        green: { bg: 'bg-green-100', text: 'text-green-600', iconBg: 'bg-green-50' },
    };

    const trendIcons = {
        up: 'trending-up',
        down: 'trending-down'
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h2 className={`text-3xl font-bold text-gray-800 mt-1 ${pulse ? 'animate-pulse' : ''}`}>{value}</h2>
                    {status && (
                        <p className={`text-${color}-500 text-sm mt-2`}>
                            <i data-feather={icon} className="w-4 h-4 inline"></i> {status}
                        </p>
                    )}
                    {trend && (
                        <p className={`text-${trend === 'up' ? 'green' : 'red'}-500 text-sm mt-2`}>
                            <i data-feather={trendIcons[trend]} className="w-4 h-4 inline"></i> {trendValue} {trend === 'up' ? 'from yesterday' : ''}
                        </p>
                    )}
                </div>
                <div className={colors[color].text}>
                    <i data-feather={icon} className="w-12 h-12"></i>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
