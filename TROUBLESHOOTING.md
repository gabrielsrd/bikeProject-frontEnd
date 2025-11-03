# 🔧 Troubleshooting - Setas de Fluxo

## ⚠️ Problemas Comuns e Soluções

### 1. **Setas não aparecem no mapa**

#### Causas possíveis:
- [ ] Switch de "Fluxos de Viagens" está desativado
- [ ] Limiar muito alto (nenhum fluxo atinge o valor)
- [ ] Backend não está rodando
- [ ] Erro na API

#### Soluções:
```bash
# 1. Verificar se backend está rodando
curl http://localhost:8000/api/trip_flows/?limit=5

# 2. Verificar console do navegador (F12)
# Procure por erros de rede ou JavaScript

# 3. Diminuir o limiar
# Ajuste o controle deslizante para 50 viagens

# 4. Verificar filtros
# Tente desativar filtro USP para ver mais fluxos
```

---

### 2. **API retorna erro 500**

#### Causa:
Backend com erro de configuração ou banco de dados

#### Solução:
```bash
cd bikeProject-backEnd

# Verificar logs do Django
# O erro aparecerá no terminal

# Verificar migrations
python manage.py migrate

# Testar endpoint diretamente
python test_trip_flows.py
```

---

### 3. **Setas aparecem mas sem cores/espessura**

#### Causa:
CSS não carregado

#### Solução:
```bash
# Verificar se o arquivo existe
ls src/components/Map/FlowArrows.css

# Verificar import no Mapa.js
grep "FlowArrows.css" src/Mapa.js

# Reiniciar servidor frontend
npm start
```

---

### 4. **Performance lenta ao ativar fluxos**

#### Causas:
- Limiar muito baixo (muitas setas)
- Muitos dados sendo processados

#### Soluções:
```javascript
// Em Mapa.js, ajuste:
const flowFilters = {
  limit: 50,  // Reduzir de 100 para 50
  minTrips: 150  // Aumentar limiar padrão
};
```

Ou ajuste o limiar no controle deslizante para 200-300 viagens.

---

### 5. **CORS Error**

#### Erro no console:
```
Access to XMLHttpRequest at 'http://localhost:8000/api/trip_flows/' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

#### Solução:
Já está configurado! Mas se aparecer, verifique:

```python
# Em myproject/settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
```

---

### 6. **Tooltip não aparece ao passar mouse**

#### Causa:
Leaflet Tooltip não configurado corretamente

#### Verificação:
```javascript
// Em FlowArrows.js, verificar:
import { Polyline, Tooltip } from "react-leaflet";

// E no JSX:
<Polyline>
  <Tooltip>...</Tooltip>
</Polyline>
```

---

### 7. **Controle deslizante não funciona**

#### Causa:
Estado não está atualizando

#### Verificação:
```javascript
// Em MapControls.js
onChange={(e) => setFlowThreshold(parseInt(e.target.value))}
//                                ^^^^^^^ importante converter para int
```

---

### 8. **Setas aparecem mas não há gradiente de cores**

#### Causa:
Cálculo de intensidade incorreto

#### Verificação:
```javascript
// Em FlowArrows.js, no getFlowStyle:
const intensity = range > 0 ? (tripCount - min) / range : 0.5;
// Verificar se max e min estão corretos
console.log('Max:', max, 'Min:', min, 'Range:', range);
```

---

## 🐛 Debug Mode

Para ativar modo debug, adicione console.logs:

```javascript
// Em useFlows.js
useEffect(() => {
  const fetchFlows = async () => {
    console.log('🔍 Buscando fluxos com filtros:', filters);
    const data = await flowService.getTripFlows(filters);
    console.log('✅ Fluxos recebidos:', data.length);
    setFlows(data);
  };
  fetchFlows();
}, [filters]);
```

```javascript
// Em FlowArrows.js
const flowStats = useMemo(() => {
  const filtered = flows.filter(f => f.trip_count >= minThreshold);
  console.log(`📊 Fluxos filtrados: ${filtered.length}/${flows.length}`);
  console.log('Min:', min, 'Max:', max);
  return { max, min, filtered };
}, [flows, minThreshold]);
```

---

## 🧪 Testes Rápidos

### Teste 1: Backend
```bash
curl -s "http://localhost:8000/api/trip_flows/?limit=3" | python3 -m json.tool
```
**Esperado:** JSON com 3 fluxos

### Teste 2: Frontend Console
```javascript
// No console do navegador (F12)
localStorage.clear();  // Limpar cache
location.reload();     // Recarregar página
```

### Teste 3: Verificar Estado
```javascript
// Adicionar no Mapa.js temporariamente
useEffect(() => {
  console.log('Flows:', flows.length);
  console.log('Show Arrows:', showFlowArrows);
  console.log('Threshold:', flowThreshold);
}, [flows, showFlowArrows, flowThreshold]);
```

---

## 📞 Checklist Completo

Antes de reportar um problema, verifique:

- [ ] Backend rodando (`http://localhost:8000`)
- [ ] Frontend rodando (`http://localhost:3000`)
- [ ] Switch "Fluxos de Viagens" ATIVADO
- [ ] Limiar não muito alto (testar com 50)
- [ ] Console do navegador sem erros (F12)
- [ ] Network tab mostra request para `/api/trip_flows/`
- [ ] Request retorna status 200
- [ ] Resposta contém array de objetos
- [ ] Filtro USP desativado (para ver mais fluxos)

---

## 🆘 Última Tentativa

Se nada funcionar:

```bash
# 1. Resetar tudo
cd bikeProject-frontEnd
rm -rf node_modules package-lock.json
npm install
npm start

# 2. Verificar backend
cd bikeProject-backEnd
source venv/bin/activate
python test_trip_flows.py

# 3. Verificar dados
python manage.py shell
>>> from ciclovias.models import Trip
>>> Trip.objects.count()
# Deve retornar número > 0
```

---

## ✅ Tudo Funcionando!

Se você vê:
- ✅ Setas coloridas no mapa
- ✅ Tooltip ao passar mouse
- ✅ Controle deslizante ajusta setas
- ✅ Legenda aparece no canto

**🎉 Parabéns! A implementação está completa!**
