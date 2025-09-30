# Filter Context Separation

## Overview
Successfully separated the filter contexts to provide better user experience and clearer functionality separation between map display and data analysis.

## Filter Separation

### Map Controls (Display Filters)
**Location**: Map sidebar controls
**Purpose**: Control what is displayed on the map
**Filters Available**:

1. **Layer Controls**
   - **Ciclostations Toggle**: Show/hide bike station markers
   - **Ciclovias Toggle**: Show/hide bike lane polylines

2. **Display Filters**
   - **USP Filter**: Show only University stations (IDs 242-260) on the map
   - **Purpose**: Reduces visual clutter and improves performance for campus-focused analysis

### Detailed Analysis Controls (Histogram Modal)
**Location**: Inside the histogram modal when clicking on a station
**Purpose**: Control which data is included in the analysis
**Filters Available**:

1. **Days of Week Filter**
   - Select specific days for analysis (Monday=0 to Sunday=6)
   - Default: Weekdays only (Monday-Friday)
   - Use case: Compare weekday vs weekend patterns

2. **Month Exclusion Filter**
   - Exclude specific months from analysis
   - Default: No months excluded
   - Use case: Remove vacation periods or recess months

3. **Date Range Filter**
   - Set specific start and end dates
   - Default: All available data
   - Use case: Focus on specific time periods

4. **Quick Presets**
   - **Reset Filters**: Return to defaults (weekdays only)
   - **Brazilian Academic Periods**: Exclude January, July, December

## Benefits of Separation

### 1. **Clearer Context**
- Map filters affect visual display
- Analysis filters affect data computation
- Users understand what each filter controls

### 2. **Better Performance**
- Map display filters reduce rendering load
- Analysis filters only affect histogram calculations
- Separate optimization strategies for each context

### 3. **Improved UX**
- Map controls stay persistent and accessible
- Analysis filters appear when relevant (in modal)
- Reduced cognitive load with context-appropriate filters

### 4. **Workflow Optimization**
- **Map Exploration**: Use map filters to find stations of interest
- **Detailed Analysis**: Use analysis filters to refine data investigation
- **Academic Research**: Quick presets for common academic scenarios

## Technical Implementation

### State Management
```javascript
// Map display state (in Mapa.js)
const [showStations, setShowStations] = useState(true);
const [showCiclovias, setShowCiclovias] = useState(true);
const [uspMapFilter, setUspMapFilter] = useState(true);

// Histogram analysis state (in Mapa.js)
const [histogramFilters, setHistogramFilters] = useState({
  selectedDays: [0, 1, 2, 3, 4], // Default weekdays
  excludeMonths: [],
  startDate: "",
  endDate: "",
  selectedStationId: null
});
```

### Component Communication
- **MapControls**: Receives map display props only
- **HistogramModal**: Receives and manages analysis filters independently
- **StationMarkers**: Uses map display filters for rendering
- **useHistogram hook**: Uses analysis filters for data fetching

## Usage Patterns

### Academic Research
1. **Setup**: Use USP filter to focus on campus stations
2. **Exploration**: Navigate map to find stations of interest
3. **Analysis**: Open station histogram with academic period filters
4. **Comparison**: Switch between stations maintaining analysis filters

### City Planning
1. **Overview**: Show all stations and bike lanes
2. **Focus**: Select specific geographic areas using map controls
3. **Temporal Analysis**: Use date ranges and day filters for traffic patterns
4. **Report Generation**: Apply consistent filters across multiple stations

### Performance Monitoring
1. **Real-time View**: Use map filters for current operational status
2. **Historical Analysis**: Use analysis filters for trend identification
3. **Comparative Studies**: Maintain analysis settings while exploring different stations

## Migration Notes

### Breaking Changes
- MapControls component props changed
- Filter state structure reorganized
- Analysis filters moved to histogram modal

### Backward Compatibility
- API endpoints unchanged
- Data structures maintained
- Core functionality preserved

### Future Enhancements
- Save/load filter presets
- Share analysis configurations
- Export filtered data
- Advanced temporal filters (e.g., seasons, holidays)