# ⚙️ Configurações Avançadas - Setas de Fluxo

## 🎨 Personalização de Cores

### Alterar esquema de cores em `FlowArrows.js`:

```javascript
const getFlowStyle = (tripCount) => {
  // ... código existente ...
  
  // OPÇÃO 1: Gradiente Azul → Verde → Vermelho
  let color;
  if (intensity < 0.33) {
    color = "#2196F3"; // Azul
  } else if (intensity < 0.66) {
    color = "#4CAF50"; // Verde
  } else {
    color = "#F44336"; // Vermelho
  }
  
  // OPÇÃO 2: Tons de vermelho (calor)
  const hue = 0; // Vermelho
  const saturation = 100;
  const lightness = 70 - (intensity * 40); // 70% → 30%
  color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  
  // OPÇÃO 3: Escala personalizada
  if (intensity < 0.25) color = "#E3F2FD"; // Azul muito claro
  else if (intensity < 0.5) color = "#64B5F6"; // Azul médio
  else if (intensity < 0.75) color = "#FFA726"; // Laranja
  else color = "#EF5350"; // Vermelho forte
  
  return { weight, color, opacity: 0.7 };
};
```

---

## 📏 Ajustar Espessura das Setas

```javascript
// Em FlowArrows.js

// PADRÃO: 2px - 8px
const weight = 2 + (intensity * 6);

// MAIS FINAS: 1px - 4px
const weight = 1 + (intensity * 3);

// MAIS GROSSAS: 3px - 12px
const weight = 3 + (intensity * 9);

// PROGRESSÃO NÃO LINEAR (mais dramática)
const weight = 2 + Math.pow(intensity, 2) * 10;
```

---

## 🎯 Modificar Limites do Controle

### Em `MapControls.js`:

```javascript
// PADRÃO: 50-500
<Form.Range
  min="50"
  max="500"
  step="50"
  value={flowThreshold}
  onChange={(e) => setFlowThreshold(parseInt(e.target.value))}
/>

// MAIS GRANULAR: 10-200 (mais sensível)
<Form.Range
  min="10"
  max="200"
  step="10"
  value={flowThreshold}
  onChange={(e) => setFlowThreshold(parseInt(e.target.value))}
/>

// VALORES ALTOS: 100-1000 (apenas principais)
<Form.Range
  min="100"
  max="1000"
  step="100"
  value={flowThreshold}
  onChange={(e) => setFlowThreshold(parseInt(e.target.value))}
/>
```

---

## 🔢 Ajustar Número Máximo de Fluxos

### Em `Mapa.js`:

```javascript
const flowFilters = {
  selectedDays: histogramFilters.selectedDays,
  excludeMonths: histogramFilters.excludeMonths,
  uspFilter: uspMapFilter,
  
  // PADRÃO: Top 100
  limit: 100,
  
  // MAIS FLUXOS: Top 200 (mais completo, pode ser lento)
  limit: 200,
  
  // MENOS FLUXOS: Top 50 (mais rápido)
  limit: 50,
  
  minTrips: flowThreshold
};
```

---

## 🎭 Adicionar Opacidade Variável

### Em `FlowArrows.js`:

```javascript
const getFlowStyle = (tripCount) => {
  // ... código existente ...
  
  // OPACIDADE FIXA
  const opacity = 0.7;
  
  // OPACIDADE VARIÁVEL (mais transparente = menos viagens)
  const opacity = 0.3 + (intensity * 0.5); // 0.3 - 0.8
  
  // OPACIDADE INVERSA (mais transparente = mais viagens)
  const opacity = 0.9 - (intensity * 0.4); // 0.9 - 0.5
  
  return { weight, color, opacity };
};
```

---

## 🎨 Adicionar Borda nas Setas

### Em `FlowArrows.css`:

```css
.flow-arrow {
  transition: all 0.3s ease;
  cursor: pointer;
  
  /* Adicionar borda branca */
  stroke-width: 1px !important;
  stroke: white;
  stroke-linejoin: round;
  stroke-linecap: round;
}

/* Ou borda preta para contraste */
.flow-arrow {
  filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
}
```

---

## 🎬 Adicionar Animação nas Setas

### Em `FlowArrows.css`:

```css
/* Animação de pulso */
@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.flow-arrow {
  animation: pulse 2s ease-in-out infinite;
}

/* Animação de movimento */
@keyframes dash {
  to {
    stroke-dashoffset: -20;
  }
}

.flow-arrow {
  stroke-dasharray: 10, 5;
  animation: dash 1s linear infinite;
}

/* Fade in suave */
@keyframes fadeInArrow {
  from {
    opacity: 0;
    stroke-width: 0;
  }
  to {
    opacity: 0.7;
    stroke-width: 2;
  }
}

.flow-arrow {
  animation: fadeInArrow 0.8s ease-out;
}
```

---

## 📱 Ajustar para Mobile

### Em `FlowArrows.js`:

```javascript
// Detectar mobile
const isMobile = window.innerWidth < 768;

const getFlowStyle = (tripCount) => {
  // Setas mais finas em mobile
  const baseWeight = isMobile ? 1 : 2;
  const maxWeight = isMobile ? 4 : 8;
  const weight = baseWeight + (intensity * (maxWeight - baseWeight));
  
  return { weight, color, opacity: 0.7 };
};
```

---

## 🎯 Filtro por Direção

### Adicionar em `Mapa.js`:

```javascript
const [flowDirection, setFlowDirection] = useState('both'); // 'outbound', 'inbound', 'both'

// Modificar flowFilters
const flowFilters = {
  // ... outros filtros ...
  direction: flowDirection, // passar para API
};
```

### Adicionar no backend (`views.py`):

```python
class TripFlowsAPIView(APIView):
    def get(self, request):
        # ... código existente ...
        
        direction = request.query_params.get('direction', 'both')
        
        if direction == 'outbound':
            # Apenas saídas de uma região
            queryset = queryset.filter(
                initial_station__station_id__in=region_stations
            )
        elif direction == 'inbound':
            # Apenas entradas em uma região
            queryset = queryset.filter(
                final_station__station_id__in=region_stations
            )
        
        # ... resto do código ...
```

---

## 🔍 Adicionar Tooltip Personalizado

### Em `FlowArrows.js`:

```javascript
<Tooltip direction="center" permanent={false}>
  <div style={{ 
    textAlign: 'center',
    minWidth: '150px',
    padding: '5px'
  }}>
    {/* Adicionar porcentagem */}
    <strong>{flow.trip_count} viagens</strong>
    <br />
    <small style={{ color: '#666' }}>
      ({((flow.trip_count / flowStats.max) * 100).toFixed(1)}% do máximo)
    </small>
    <br />
    
    {/* Adicionar horário de pico */}
    <small>Origem: {flow.origin_station_name}</small>
    <br />
    <small>Destino: {flow.destination_station_name}</small>
    <br />
    
    {/* Adicionar distância */}
    <small style={{ color: '#999' }}>
      ~{calculateDistance(flow.origin_coords, flow.destination_coords).toFixed(1)} km
    </small>
  </div>
</Tooltip>
```

---

## 📊 Adicionar Legenda Avançada

### Em `FlowArrows.js`:

```javascript
{flowStats.filtered.length > 0 && (
  <div className="flow-legend-advanced">
    <h6>Fluxos de Viagens</h6>
    
    <div className="legend-stats">
      <div>Total de rotas: <strong>{flowStats.filtered.length}</strong></div>
      <div>Viagens totais: <strong>{flowStats.filtered.reduce((sum, f) => sum + f.trip_count, 0)}</strong></div>
    </div>
    
    <div className="legend-scale">
      <div>
        <span style={{ color: '#4CAF50', fontSize: '20px' }}>●</span>
        <span>Baixo ({flowStats.min} viagens)</span>
      </div>
      <div>
        <span style={{ color: '#FFC107', fontSize: '20px' }}>●</span>
        <span>Médio</span>
      </div>
      <div>
        <span style={{ color: '#F44336', fontSize: '20px' }}>●</span>
        <span>Alto ({flowStats.max} viagens)</span>
      </div>
    </div>
    
    <div className="legend-thickness">
      <small>Espessura da linha = Volume</small>
    </div>
  </div>
)}
```

---

## 🚀 Performance: Carregar Apenas Viewport

### Em `FlowArrows.js`:

```javascript
import { useMap } from "react-leaflet";

export const FlowArrows = ({ flows, visible, minThreshold }) => {
  const map = useMap();
  
  // Filtrar apenas fluxos visíveis no mapa
  const visibleFlows = useMemo(() => {
    if (!map || !flows) return [];
    
    const bounds = map.getBounds();
    
    return flows.filter(flow => {
      const [lat1, lng1] = flow.origin_coords;
      const [lat2, lng2] = flow.destination_coords;
      
      return (
        bounds.contains([lat1, lng1]) || 
        bounds.contains([lat2, lng2])
      );
    });
  }, [flows, map]);
  
  // Usar visibleFlows ao invés de flows
};
```

---

## 💾 Salvar Configurações

### Em `Mapa.js`:

```javascript
// Salvar no localStorage
useEffect(() => {
  localStorage.setItem('flowThreshold', flowThreshold);
  localStorage.setItem('showFlowArrows', showFlowArrows);
}, [flowThreshold, showFlowArrows]);

// Carregar do localStorage
useEffect(() => {
  const savedThreshold = localStorage.getItem('flowThreshold');
  const savedShow = localStorage.getItem('showFlowArrows');
  
  if (savedThreshold) setFlowThreshold(parseInt(savedThreshold));
  if (savedShow) setShowFlowArrows(savedShow === 'true');
}, []);
```

---

Escolha as personalizações que melhor se adequam ao seu caso de uso! 🎨✨
