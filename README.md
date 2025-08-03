# Health Monitoring Mobile App - Mock Demo

A comprehensive React Native/Expo mobile application for health monitoring with detailed mock data and interactive charts.

## 🚀 Features

### 📱 Home Screen
- **Real-time Vital Signs**: Heart Rate, SpO₂, Temperature, and Steps
- **Interactive Cards**: Click any vital card to view detailed historical charts
- **Live Updates**: Simulated real-time data updates every 2 seconds
- **Emergency SOS**: Floating emergency button for quick access

### 📊 History Screen
- **Multiple Time Periods**: Average, Day, Week, and Month views
- **Detailed Charts**: Interactive line and bar charts for each metric
- **Comprehensive Data**: 30 days of realistic mock health data
- **Smart Aggregation**: Automatic data grouping and averaging

### 👨‍👩‍👧‍👦 Family Screen
- **Family Member Management**: Add, remove, and monitor family members
- **Health Overview**: Quick vital signs display for each family member
- **Detailed Health Access**: Navigate to individual family member health charts
- **Invite System**: Share invite codes and manage pending invites

### 👤 Profile Screen
- **User Information**: Personal details and account management
- **Settings**: App preferences and notification controls
- **Help & Support**: FAQ and support access

## 🛠 Technical Implementation

### Data Structure
```typescript
interface VitalData {
  heartRate: number;
  spO2: number;
  temperature: number;
  steps: number;
  timestamp: Date;
}

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  vitals: VitalData[];
}
```

### Mock Data Generation
- **Realistic Patterns**: Heart rate varies by time of day (lower at night)
- **Temperature Variations**: Slight daily temperature fluctuations
- **Step Counting**: No steps during night hours, realistic daily totals
- **SpO₂ Stability**: Maintains healthy oxygen saturation levels

### Chart Features
- **Interactive Periods**: Day, Week, Month views with smooth transitions
- **Color-coded Metrics**: Each vital sign has its own color scheme
- **Average Calculations**: Real-time average computation for each period
- **Responsive Design**: Charts adapt to different screen sizes

## 📱 Screens Overview

### 1. Home Screen (`app/(tabs)/index.tsx`)
- Displays current vital signs in card format
- Clickable cards navigate to detailed charts
- Real-time data simulation
- Emergency SOS functionality

### 2. History Screen (`app/(tabs)/history.tsx`)
- Four time period views: Average, Day, Week, Month
- Interactive period selector
- Detailed charts for each health metric
- Navigation to individual metric details

### 3. Family Screen (`app/(tabs)/family.tsx`)
- Family member management
- Quick vital signs overview
- "View Health" buttons for detailed access
- Invite code sharing system

### 4. Vital Detail Screen (`app/vital-detail.tsx`)
- Detailed charts for individual metrics
- Time period selection (Day, Week, Month)
- Back navigation to home screen

### 5. Family Health Screen (`app/family-health.tsx`)
- Individual family member health charts
- All four vital signs displayed
- Time period filtering
- Personalized member information

## 🎨 Design Features

### Color Scheme
- **Heart Rate**: Red (#ff4757)
- **SpO₂**: Blue (#04A7F5)
- **Temperature**: Orange (#ffa502)
- **Steps**: Green (#2ed573)

### UI Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Charts**: Smooth animations and responsive design
- **Navigation**: Intuitive tab-based navigation

## 📊 Data Visualization

### Chart Types
- **Line Charts**: For continuous data like heart rate and temperature
- **Bar Charts**: For discrete data like steps
- **Sparklines**: Mini charts in summary views

### Data Aggregation
- **Hourly**: For daily views
- **Daily**: For weekly views
- **Weekly**: For monthly views
- **Averages**: Calculated for each time period

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

### Running the App
1. Start the development server: `npm run dev`
2. Scan the QR code with Expo Go app
3. Or press 'w' to open in web browser
4. Or press 'i' for iOS simulator / 'a' for Android emulator

## 📱 App Navigation

### Main Tabs
- **Home**: Current vital signs and emergency access
- **History**: Detailed health trends and charts
- **Family**: Family member management and health monitoring
- **Profile**: User settings and account management

### Detailed Screens
- **Vital Detail**: Individual metric charts with time periods
- **Family Health**: Individual family member health data
- **Auth**: Phone number verification and OTP
- **Onboarding**: App introduction and setup

## 🔧 Customization

### Adding New Metrics
1. Update `VitalData` interface in `data/mockVitals.ts`
2. Add metric to `generateMockVitals` function
3. Update UI components to display new metric
4. Add chart configuration for new metric

### Modifying Mock Data
- Adjust `generateMockVitals` function for different data patterns
- Modify time periods in `getVitalsByPeriod` function
- Update family member data in `generateFamilyVitals`

### Styling Changes
- Update color schemes in component files
- Modify chart configurations in `HealthChart.tsx`
- Adjust layout and spacing in StyleSheet objects

## 📈 Mock Data Characteristics

### Heart Rate
- Base: 70 bpm
- Daily variation: ±10 bpm
- Night pattern: Lower during sleep hours
- Realistic fluctuations throughout day

### SpO₂
- Range: 95-99%
- Stable with minor variations
- Maintains healthy oxygen levels
- Realistic for healthy individuals

### Temperature
- Base: 36.5°C
- Daily variation: ±0.5°C
- Slight circadian rhythm
- Normal body temperature range

### Steps
- Daily target: 8,000-12,000 steps
- No activity during night hours
- Realistic daily patterns
- Cumulative counting

## 🎯 Demo Use Cases

### For Designers
- **UI/UX Reference**: Complete mobile app interface
- **Interaction Patterns**: Navigation and user flows
- **Data Visualization**: Chart implementations
- **Responsive Design**: Cross-platform compatibility

### For Developers
- **React Native Patterns**: Component structure and state management
- **Expo Router**: Navigation implementation
- **Chart Integration**: react-native-chart-kit usage
- **Mock Data**: Realistic data generation patterns

### For Product Managers
- **Feature Overview**: Complete health monitoring app
- **User Journey**: End-to-end user experience
- **Data Requirements**: Health metrics and time periods
- **Family Features**: Multi-user health monitoring

## 🔮 Future Enhancements

### Potential Additions
- **Real-time Alerts**: Abnormal vital sign notifications
- **Data Export**: Health report generation
- **Device Integration**: Actual health device connectivity
- **Social Features**: Health challenges and sharing
- **AI Insights**: Health trend analysis and predictions

### Technical Improvements
- **Offline Support**: Local data storage
- **Push Notifications**: Real-time alerts
- **Data Sync**: Cloud synchronization
- **Performance**: Optimized chart rendering
- **Accessibility**: Screen reader support

## 📄 License

This project is a mock demo for demonstration purposes.

---

**Note**: This is a comprehensive mock demo designed to showcase health monitoring app capabilities. All data is simulated and should not be used for actual health monitoring purposes. 