// =============================================================
// TRANSLATIONS — i18n system
// =============================================================
const TRANSLATIONS = {
    pt: {
        'sidebar.subtitle': 'Multi-Agent AI Platform',
        'sidebar.newTrip': 'Novo Roteiro',
        'sidebar.history': 'Histórico de Viagens',
        'sidebar.loading': 'Carregando histórico...',
        'sidebar.status': 'Google AI Studio Ativo',
        'form.heading': 'Para onde vamos hoje?',
        'form.subheading': 'Preencha os dados e deixe nossa equipe de sub-agentes inteligentes desenhar o roteiro ideal, rotas, gastronomia e eventos.',
        'form.chooseStyle': 'Escolha um Estilo de Roteiro:',
        'form.submit': 'Orquestrar Viagem com Inteligência Artificial',
        'field.origin': 'Origem',
        'field.optional': '(opcional)',
        'field.destination': 'Destino',
        'field.startDate': 'Data de Início',
        'field.endDate': 'Data de Retorno',
        'field.budget': 'Orçamento Máximo',
        'field.dietary': 'Restrições Alimentares',
        'field.availableHours': 'Horários Disponíveis para Visitas',
        'field.preferences': 'Preferências de Viagem (Selecione as que combinam com você)',
        'field.fridge': 'Ingredientes já existentes em casa (para a receita típica)',
        'field.description': 'Instruções ou Desejos Especiais',
        'template.roadtrip.title': 'Road Trip / Estrada',
        'template.roadtrip.desc': 'Natal para Fortaleza, paradas panorâmicas, hotéis de estrada, previsão de clima e postos.',
        'template.business.title': 'Congresso / Negócios',
        'template.business.desc': 'Congresso em Milão, agenda, deslocamentos urbanos rápidos, checklists e vestuário correto.',
        'template.gastronomy.title': 'Explorador Gastronômico',
        'template.gastronomy.desc': 'Comida típica regional, ranking de restaurantes, receitas locais e lista de compras com custos.',
        'template.custom.title': 'Orquestrador Livre',
        'template.custom.desc': 'Planejamento completo customizado com ativação dinâmica de múltiplos sub-agentes.',
        'pref.historical': 'Locais Históricos',
        'pref.nature': 'Praias & Natureza',
        'pref.museums': 'Museus & Artes',
        'pref.festive': 'Festivo / Baladas',
        'pref.adventure': 'Aventura / Trilhas',
        'pref.shopping': 'Compras / Mercados',
        'loading.title': 'Ativando Rede Multi-Agente...',
        'loading.subtitle': 'O Orquestrador está analisando sua solicitação e disparando os sub-agentes em paralelo no Google AI Studio.',
        'result.badge': 'Multi-Agente Coordenado',
        'result.back': 'Modificar Roteiro',
        'tab.map': 'Rota & Mapa',
        'tab.cuisine': 'Gastronomia & Receitas',
        'tab.logistics': 'Hospedagem & Clima',
        'tab.agenda': 'Atividades & Eventos',
        'tab.traces': 'Rastreamento IA',
        'map.distance': 'Distância Prevista',
        'map.duration': 'Tempo de Percurso',
        'map.view': 'Visualização do Mapa',
        'map.straightLine': 'Reta Direta',
        'map.snapped': 'Ajustado às Estradas',
        'map.loading': 'Carregando...',
        'map.routePoints': 'Pontos da Rota Sugeridos',
        'cuisine.typicalDishes': 'Pratos Típicos da Região',
        'cuisine.ranking': 'Ranking de Restaurantes Recomendados',
        'cuisine.dishName': 'Nome do Prato',
        'cuisine.history': 'História e Cultura',
        'cuisine.recipe': 'Receita & Preparo',
        'cuisine.shopping': 'Lista de Compras',
        'cuisine.ingredients': 'Ingredientes Necessários',
        'cuisine.steps': 'Modo de Preparo',
        'cuisine.toBuy': 'Ingredientes a Comprar',
        'cuisine.estimatedCost': 'Custo Estimado',
        'cuisine.shoppingIntro': 'Ingredientes que faltam no seu armário:',
        'cuisine.restLocation': 'Localização do Restaurante',
        'cuisine.backToDish': 'Ver Prato Típico',
        'cuisine.menu': 'Cardápio Sugerido',
        'cuisine.menuIntro': 'Especialidades recomendadas com preços estimados (clique para detalhes):',
        'cuisine.recommended': 'Recomendado',
        'cuisine.viewMapMenu': 'Ver no Mapa & Cardápio',
        'cuisine.noMenu': 'Cardápio não disponível online.',
        'cuisine.noIngredients': 'Nenhum ingrediente adicional a comprar! Você já tem o necessário em casa.',
        'logistics.lodging': 'Opções de Hospedagem',
        'logistics.transit': 'Transporte & Deslocamento',
        'logistics.references': 'Referências:',
        'logistics.weather': 'Previsão do Tempo no Destino',
        'logistics.packing': 'Análise de Vestuário & Malas',
        'logistics.checklist': 'Checklist de Malas (Clique para embalar)',
        'logistics.hotelName': 'Nome da Hospedagem',
        'logistics.backToWeather': 'Ver Clima',
        'logistics.amenities': 'Serviços e Dependências',
        'logistics.hotelLocation': 'Localização & Acomodações',
        'logistics.roomTypes': 'Tipos de Quarto Disponíveis',
        'logistics.packed': 'Embalado ✓',
        'logistics.noCoords': 'Coordenadas de mapa não disponíveis para este hotel.',
        'agenda.sightseeing': 'Atrações Turísticas Sugeridas',
        'agenda.events': 'Eventos Locais nas Datas',
        'agenda.dailyAgenda': 'Agenda Diária Recomendada',
        'agenda.checklist': 'Checklist da Viagem',
        'agenda.attractionName': 'Nome da Atração',
        'agenda.backToAgenda': 'Ver Agenda',
        'agenda.practical': 'Informações Práticas',
        'agenda.mapLocation': 'Localização no Mapa',
        'agenda.noEvents': 'Nenhum evento local de grande porte previsto para estas datas.',
        'agenda.noCoords': 'Coordenadas de mapa não disponíveis para esta atividade.',
        'traces.title': 'Logs de Execução da IA (Multi-Agent Audit Trail)',
        'traces.desc': 'Este painel mostra a rastreabilidade técnica do sistema agêntico. Veja abaixo as decisões e pensamentos estruturados emitidos por cada sub-agente durante a orquestração paralela no Google AI Studio.',
        'console.loading': 'Carregando',
        'console.processing': 'Processando',
        'console.success': 'Sucesso',
        'console.failed': 'Falha',
        'console.warning': 'Aviso',
        'console.dbFetch': 'Buscando registro de viagem ID ${id} no banco de dados local...',
        'misc.deleteConfirm': 'Tem certeza que deseja excluir esta viagem do histórico?',
        'misc.noGeoData': 'Nenhum dado geográfico gerado por este roteiro.',
        'misc.noHistory': 'Nenhuma viagem orquestrada ainda.',
        'misc.destRequired': 'Destino é um campo obrigatório.',
        'misc.tripType.roadtrip': 'Road Trip',
        'misc.tripType.business': 'Congresso / Negócios',
        'misc.tripType.gastronomy': 'Gastronomia',
        'misc.tripType.custom': 'Orquestrado',
        'misc.noRestCoords': 'Coordenadas de mapa não disponíveis para este restaurante.',
        'misc.notInformed': 'Não informado',
        'misc.roomsOnRequest': 'Quartos sob consulta',
        'misc.free': 'Gratuito',
        'misc.anyTime': 'Qualquer horário',
        'misc.venue': 'Local',
        'misc.date': 'Data',
        'misc.cost': 'Custo',
        'misc.bestTime': 'Melhor Horário',
        'misc.attraction': 'Atração',
        'misc.event': 'Evento',
        'misc.noGeoActivity': 'Coordenadas de mapa não disponíveis para esta atividade.',
        'misc.quantity': 'qtd',
    },
    en: {
        'sidebar.subtitle': 'Multi-Agent AI Platform',
        'sidebar.newTrip': 'New Itinerary',
        'sidebar.history': 'Trip History',
        'sidebar.loading': 'Loading history...',
        'sidebar.status': 'Google AI Studio Active',
        'form.heading': 'Where are we going today?',
        'form.subheading': 'Fill in the details and let our team of intelligent sub-agents design the ideal itinerary, routes, gastronomy, and events.',
        'form.chooseStyle': 'Choose an Itinerary Style:',
        'form.submit': 'Orchestrate Trip with Artificial Intelligence',
        'field.origin': 'Origin',
        'field.optional': '(optional)',
        'field.destination': 'Destination',
        'field.startDate': 'Start Date',
        'field.endDate': 'Return Date',
        'field.budget': 'Maximum Budget',
        'field.dietary': 'Dietary Restrictions',
        'field.availableHours': 'Available Hours for Visits',
        'field.preferences': 'Travel Preferences (Select the ones that suit you)',
        'field.fridge': 'Ingredients already at home (for the typical recipe)',
        'field.description': 'Special Instructions or Wishes',
        'template.roadtrip.title': 'Road Trip',
        'template.roadtrip.desc': 'Natal to Fortaleza, scenic stops, roadside hotels, weather forecast and gas stations.',
        'template.business.title': 'Conference / Business',
        'template.business.desc': 'Conference in Milan, schedule, fast urban transit, checklists and proper attire.',
        'template.gastronomy.title': 'Gastronomic Explorer',
        'template.gastronomy.desc': 'Regional typical food, restaurant ranking, local recipes and shopping list with costs.',
        'template.custom.title': 'Free Orchestrator',
        'template.custom.desc': 'Fully customized planning with dynamic activation of multiple sub-agents.',
        'pref.historical': 'Historical Sites',
        'pref.nature': 'Beaches & Nature',
        'pref.museums': 'Museums & Arts',
        'pref.festive': 'Festive / Nightlife',
        'pref.adventure': 'Adventure / Hiking',
        'pref.shopping': 'Shopping / Markets',
        'loading.title': 'Activating Multi-Agent Network...',
        'loading.subtitle': 'The Orchestrator is analyzing your request and dispatching sub-agents in parallel on Google AI Studio.',
        'result.badge': 'Coordinated Multi-Agent',
        'result.back': 'Modify Itinerary',
        'tab.map': 'Route & Map',
        'tab.cuisine': 'Gastronomy & Recipes',
        'tab.logistics': 'Lodging & Weather',
        'tab.agenda': 'Activities & Events',
        'tab.traces': 'AI Tracing',
        'map.distance': 'Estimated Distance',
        'map.duration': 'Travel Time',
        'map.view': 'Map View',
        'map.straightLine': 'Straight Line',
        'map.snapped': 'Snapped to Roads',
        'map.loading': 'Loading...',
        'map.routePoints': 'Suggested Route Points',
        'cuisine.typicalDishes': 'Typical Regional Dishes',
        'cuisine.ranking': 'Recommended Restaurant Ranking',
        'cuisine.dishName': 'Dish Name',
        'cuisine.history': 'History & Culture',
        'cuisine.recipe': 'Recipe & Preparation',
        'cuisine.shopping': 'Shopping List',
        'cuisine.ingredients': 'Required Ingredients',
        'cuisine.steps': 'Preparation Steps',
        'cuisine.toBuy': 'Ingredients to Buy',
        'cuisine.estimatedCost': 'Estimated Cost',
        'cuisine.shoppingIntro': 'Ingredients missing from your pantry:',
        'cuisine.restLocation': 'Restaurant Location',
        'cuisine.backToDish': 'View Typical Dish',
        'cuisine.menu': 'Suggested Menu',
        'cuisine.menuIntro': 'Recommended specialties with estimated prices (click for details):',
        'cuisine.recommended': 'Recommended',
        'cuisine.viewMapMenu': 'View on Map & Menu',
        'cuisine.noMenu': 'Menu not available online.',
        'cuisine.noIngredients': 'No additional ingredients to buy! You already have everything needed.',
        'logistics.lodging': 'Lodging Options',
        'logistics.transit': 'Transport & Transfers',
        'logistics.references': 'References:',
        'logistics.weather': 'Destination Weather Forecast',
        'logistics.packing': 'Clothing & Luggage Analysis',
        'logistics.checklist': 'Packing Checklist (Click to pack)',
        'logistics.hotelName': 'Accommodation Name',
        'logistics.backToWeather': 'View Weather',
        'logistics.amenities': 'Services & Facilities',
        'logistics.hotelLocation': 'Location & Accommodations',
        'logistics.roomTypes': 'Available Room Types',
        'logistics.packed': 'Packed ✓',
        'logistics.noCoords': 'Map coordinates not available for this hotel.',
        'agenda.sightseeing': 'Suggested Tourist Attractions',
        'agenda.events': 'Local Events on These Dates',
        'agenda.dailyAgenda': 'Recommended Daily Agenda',
        'agenda.checklist': 'Trip Checklist',
        'agenda.attractionName': 'Attraction Name',
        'agenda.backToAgenda': 'View Agenda',
        'agenda.practical': 'Practical Information',
        'agenda.mapLocation': 'Location on Map',
        'agenda.noEvents': 'No major local events scheduled for these dates.',
        'agenda.noCoords': 'Map coordinates not available for this activity.',
        'traces.title': 'AI Execution Logs (Multi-Agent Audit Trail)',
        'traces.desc': 'This panel shows the technical traceability of the agentic system. See below the structured decisions and thoughts emitted by each sub-agent during parallel orchestration on Google AI Studio.',
        'console.loading': 'Loading',
        'console.processing': 'Processing',
        'console.success': 'Success',
        'console.failed': 'Failed',
        'console.warning': 'Warning',
        'console.dbFetch': 'Fetching trip record ID ${id} from local database...',
        'misc.deleteConfirm': 'Are you sure you want to delete this trip from history?',
        'misc.noGeoData': 'No geographic data generated for this itinerary.',
        'misc.noHistory': 'No orchestrated trips yet.',
        'misc.destRequired': 'Destination is a required field.',
        'misc.tripType.roadtrip': 'Road Trip',
        'misc.tripType.business': 'Conference / Business',
        'misc.tripType.gastronomy': 'Gastronomy',
        'misc.tripType.custom': 'Orchestrated',
        'misc.noRestCoords': 'Map coordinates not available for this restaurant.',
        'misc.notInformed': 'Not informed',
        'misc.roomsOnRequest': 'Rooms on request',
        'misc.free': 'Free',
        'misc.anyTime': 'Any time',
        'misc.venue': 'Venue',
        'misc.date': 'Date',
        'misc.cost': 'Cost',
        'misc.bestTime': 'Best Time',
        'misc.attraction': 'Attraction',
        'misc.event': 'Event',
        'misc.noGeoActivity': 'Map coordinates not available for this activity.',
        'misc.quantity': 'qty',
    }
};

// Current active language
let currentLang = localStorage.getItem('tripLang') || 'pt';

function t(key, vars) {
    let text = (TRANSLATIONS[currentLang] || TRANSLATIONS.pt)[key] || key;
    if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
            text = text.replace('${' + k + '}', v);
        });
    }
    return text;
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tripLang', lang);

    // Update lang toggle buttons
    document.getElementById('lang-btn-pt').classList.toggle('active', lang === 'pt');
    document.getElementById('lang-btn-en').classList.toggle('active', lang === 'en');

    // Update html lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    // Apply translations to all [data-i18n] elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = (TRANSLATIONS[lang] || TRANSLATIONS.pt)[key];
        if (translation !== undefined) {
            el.textContent = translation;
        }
    });

    // Re-init icons after text update
    lucide.createIcons();
}

function setLanguage(lang) {
    applyLanguage(lang);
}

// =============================================================
// GLOBAL STATE
// =============================================================
let activeTripType = 'roadtrip';
let mapInstance = null;
let mapMarkers = [];
let mapRouteLine = null;
let currentTripData = null;
let currentTripId = null;
let restaurantMapInstance = null;
let hotelMapInstance = null;
let agendaMapInstance = null;
let lastSelectedDish = null;
let lastSelectedHotel = null;
let lastSelectedActivity = null;
// Store last trip origin/destination for transport reference links
let lastTripOrigin = '';
let lastTripDestination = '';

// =============================================================
// INITIALIZATION
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Apply saved language
    applyLanguage(currentLang);

    // Fetch past trips history
    fetchHistory();

    // Form submission handler
    const form = document.getElementById('trip-config-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Back Button
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => showScreen('form-screen'));
    }

    // New Trip Button
    const btnNewTrip = document.getElementById('btn-new-trip');
    if (btnNewTrip) {
        btnNewTrip.addEventListener('click', () => {
            resetForm();
            updateFormFieldsVisibility();
            showScreen('form-screen');
        });
    }

    updateFormFieldsVisibility();
    setupTabs();
});

// =============================================================
// NAVIGATION & SCREENS
// =============================================================
function showScreen(screenId) {
    document.querySelectorAll('.workspace-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');

    if (screenId === 'results-screen' && mapInstance && typeof google !== 'undefined') {
        setTimeout(() => google.maps.event.trigger(mapInstance, 'resize'), 100);
    }
}

function setupTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            link.classList.add('active');
            const tabId = link.getAttribute('data-tab');
            const targetTab = document.getElementById(tabId);
            if (targetTab) targetTab.classList.add('active');
            if (tabId === 'tab-map' && mapInstance && typeof google !== 'undefined') {
                setTimeout(() => google.maps.event.trigger(mapInstance, 'resize'), 100);
            }
        });
    });
}

// =============================================================
// FIELD TOGGLES (optional fields enable/disable)
// =============================================================
function toggleField(fieldId, enabled) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.disabled = !enabled;
    el.style.opacity = enabled ? '1' : '0.4';
    el.style.cursor = enabled ? '' : 'not-allowed';
    if (!enabled) el.value = '';
}

// =============================================================
// TEMPLATE SELECTION & DEFAULTS
// =============================================================
function selectTemplate(type) {
    activeTripType = type;
    const tripTypeInput = document.getElementById('trip_type');
    if (tripTypeInput) tripTypeInput.value = type;

    document.querySelectorAll('.template-card').forEach(card => card.classList.remove('active'));
    const activeCard = document.querySelector(`.template-card[data-type="${type}"]`);
    if (activeCard) activeCard.classList.add('active');

    // Auto-select corresponding modules based on preset selection
    const modulesMap = {
        'roadtrip': ['road_trip', 'lodging', 'cuisine', 'agenda'],
        'business': ['lodging', 'agenda'],
        'gastronomy': ['cuisine'],
        'custom': ['road_trip', 'lodging', 'cuisine', 'agenda']
    };
    const activeModules = modulesMap[type] || ['road_trip', 'lodging', 'cuisine', 'agenda'];
    ['road_trip', 'lodging', 'cuisine', 'agenda'].forEach(m => {
        const cb = document.getElementById('module-' + m.replace('_', ''));
        if (cb) cb.checked = activeModules.includes(m);
    });

    const originGroup = document.getElementById('group-origin');
    const fridgeGroup = document.getElementById('fridge-items-group');
    const origin = document.getElementById('origin');
    const destination = document.getElementById('destination');
    const budget = document.getElementById('budget');
    const dietary = document.getElementById('dietary_restrictions');
    const description = document.getElementById('description');

    // Re-enable all optional fields with their toggles checked
    ['start_date', 'end_date', 'budget', 'dietary_restrictions'].forEach(id => {
        const toggle = document.getElementById('enable-' + id.replace('_', '-').replace('_restrictions', '').replace('_date', '-date'));
        // Use the mapping for toggle IDs
    });
    // Enable date/budget/dietary toggles
    setToggle('enable-start-date', true);
    setToggle('enable-end-date', true);
    setToggle('enable-budget', true);
    setToggle('enable-dietary', true);
    setToggle('enable-fridge', true);
    setToggle('enable-hours', false);

    if (type === 'gastronomy') {
        originGroup.style.display = 'flex';
        fridgeGroup.style.display = 'flex';
        origin.value = "Recife, PE";
        destination.value = "Salvador, BA";
        budget.value = "R$ 800";
        dietary.value = "Sem frutos do mar";
        description.value = "Quero comer pratos típicos da Bahia, mas sem frutos do mar. Vou cozinhar a moqueca em casa com ingredientes locais.";
        setCheckboxes(['historical']);
    } else if (type === 'business') {
        originGroup.style.display = 'flex';
        fridgeGroup.style.display = 'none';
        origin.value = "São Paulo, SP";
        destination.value = "Milão, Itália";
        budget.value = "R$ 12.000";
        dietary.value = "Nenhuma restrição alimentar";
        description.value = "Vou para um congresso de tecnologia em Milão. Preciso de agenda de deslocamentos rápidos de metrô/trem, hotel perto do MiCo e checklist de viagem.";
        // For business template, enable available_hours with a default value
        setToggle('enable-hours', true);
        const hoursField = document.getElementById('available_hours');
        if (hoursField) hoursField.value = "Manhãs para deslocamento, tardes no congresso, disponível somente após 19h para turismo";
        setCheckboxes(['historical', 'museums']);
    } else if (type === 'roadtrip') {
        originGroup.style.display = 'flex';
        fridgeGroup.style.display = 'none';
        origin.value = "Natal, RN";
        destination.value = "Fortaleza, CE";
        budget.value = "R$ 1.500";
        dietary.value = "Nenhuma";
        description.value = "Pretendo dirigir pelo litoral de Natal para Fortaleza. Quero recomendações de postos de combustível baratos, paradas gastronômicas rápidas e mirantes bonitos.";
        setCheckboxes(['historical', 'nature']);
    } else { // Custom
        originGroup.style.display = 'flex';
        fridgeGroup.style.display = 'flex';
        origin.value = "";
        destination.value = "";
        budget.value = "";
        dietary.value = "";
        description.value = "";
        setCheckboxes([]);
    }
    updateFormFieldsVisibility();
}

window.updateFormFieldsVisibility = function() {
    const roadtripActive = document.getElementById('module-roadtrip')?.checked ?? true;
    const lodgingActive = document.getElementById('module-lodging')?.checked ?? true;
    const cuisineActive = document.getElementById('module-cuisine')?.checked ?? true;
    const agendaActive = document.getElementById('module-agenda')?.checked ?? true;

    const originGroup = document.getElementById('group-origin');
    if (originGroup) {
        originGroup.style.display = roadtripActive ? '' : 'none';
        const originInput = document.getElementById('origin');
        if (originInput) {
            originInput.required = roadtripActive;
        }
    }

    const datesGroup = document.getElementById('group-dates');
    if (datesGroup) {
        datesGroup.style.display = (roadtripActive || lodgingActive || agendaActive) ? '' : 'none';
    }

    const budgetGroup = document.getElementById('group-budget');
    if (budgetGroup) {
        budgetGroup.style.display = lodgingActive ? '' : 'none';
    }

    const dietaryGroup = document.getElementById('group-dietary');
    if (dietaryGroup) {
        dietaryGroup.style.display = cuisineActive ? '' : 'none';
    }

    const fridgeGroup = document.getElementById('fridge-items-group');
    if (fridgeGroup) {
        const enableFridge = document.getElementById('enable-fridge')?.checked ?? true;
        fridgeGroup.style.display = (cuisineActive && enableFridge) ? '' : 'none';
    }

    const hoursGroup = document.getElementById('group-available-hours');
    if (hoursGroup) {
        hoursGroup.style.display = agendaActive ? '' : 'none';
    }

    const preferencesGroup = document.getElementById('group-preferences');
    if (preferencesGroup) {
        preferencesGroup.style.display = agendaActive ? '' : 'none';
    }

    const descGroup = document.getElementById('group-description');
    if (descGroup) {
        descGroup.style.display = roadtripActive ? '' : 'none';
    }
}

function setToggle(toggleId, checked) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;
    toggle.checked = checked;
    // Determine the field ID from the toggle ID
    const fieldMap = {
        'enable-start-date': 'start_date',
        'enable-end-date': 'end_date',
        'enable-budget': 'budget',
        'enable-dietary': 'dietary_restrictions',
        'enable-fridge': 'fridge_items',
        'enable-hours': 'available_hours',
    };
    const fieldId = fieldMap[toggleId];
    if (fieldId) toggleField(fieldId, checked);
}

function setCheckboxes(values) {
    document.querySelectorAll('input[name="preferences"]').forEach(cb => {
        cb.checked = values.includes(cb.value);
    });
}

function resetForm() {
    selectTemplate('roadtrip');
}

// =============================================================
// HISTORY ACTIONS
// =============================================================
async function fetchHistory() {
    try {
        const res = await fetch('/api/history');
        const data = await res.json();
        if (data.success) renderHistoryList(data.history);
        else console.error("Failed to load history:", data.error);
    } catch (e) {
        console.error("Error fetching history:", e);
    }
}

function renderHistoryList(history) {
    const list = document.getElementById('trips-history-list');
    if (!list) return;

    if (history.length === 0) {
        list.innerHTML = `<div class="history-loading">${t('misc.noHistory')}</div>`;
        return;
    }

    list.innerHTML = '';
    history.forEach(item => {
        const el = document.createElement('div');
        el.className = 'history-item';
        el.setAttribute('data-id', item.id);

        let icon = 'sparkles';
        if (item.trip_type === 'roadtrip') icon = 'milestone';
        else if (item.trip_type === 'business') icon = 'briefcase';
        else if (item.trip_type === 'gastronomy') icon = 'utensils';

        const dateStr = new Date(item.created_at + 'Z').toLocaleDateString(
            currentLang === 'pt' ? 'pt-BR' : 'en-US',
            { day: '2-digit', month: '2-digit', year: 'numeric' }
        );

        el.innerHTML = `
            <div class="history-item-header">
                <span class="history-title" onclick="loadTrip(${item.id})">
                    ${escapeHtml(item.title)}
                </span>
                <button class="btn-delete-trip" onclick="deleteTrip(${item.id}, event)" title="Excluir">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
            <div class="history-meta" onclick="loadTrip(${item.id})">
                <span><i data-lucide="${icon}" class="icon-small"></i> ${translateType(item.trip_type)}</span>
                <span>${escapeHtml(dateStr)}</span>
            </div>
        `;
        list.appendChild(el);
    });
    lucide.createIcons();
}

async function loadTrip(id) {
    try {
        showScreen('loading-screen');
        const consoleStream = document.getElementById('console-stream-content');
        consoleStream.innerHTML = `
            <div class="console-line thinking">
                <div class="console-line-header">
                    <span class="console-agent-name">SQLite Database</span>
                    <span class="console-status-badge">${t('console.loading')}</span>
                </div>
                <div class="console-msg">${t('console.dbFetch', { id })}</div>
            </div>
        `;

        const res = await fetch(`/api/trip/${id}`);
        const data = await res.json();

        if (data.success && data.trip) {
            document.querySelectorAll('.history-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-id') == id) item.classList.add('active');
            });

            // Restore origin/destination for transport links
            if (data.trip.input_data) {
                lastTripOrigin = data.trip.input_data.origin || '';
                lastTripDestination = data.trip.input_data.destination || '';
            }

            showScreen('results-screen');
            currentTripId = id;
            currentTripData = data.trip;
            renderResults(data.trip.title, data.trip.trip_type, data.trip.result_data, data.trip.agent_logs);
        } else {
            alert("Erro ao carregar viagem: " + (data.error || "Desconhecido"));
            showScreen('form-screen');
        }
    } catch (e) {
        console.error("Error loading trip:", e);
        alert("Erro de conexão ao carregar viagem.");
        showScreen('form-screen');
    }
}

async function deleteTrip(id, event) {
    event.stopPropagation();
    if (!confirm(t('misc.deleteConfirm'))) return;

    try {
        const res = await fetch(`/api/trip/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
            fetchHistory();
            if (currentTripData && currentTripData.id === id) {
                resetForm();
                showScreen('form-screen');
            }
        } else {
            alert("Erro ao excluir item: " + data.error);
        }
    } catch (e) {
        console.error("Error deleting trip:", e);
    }
}

// =============================================================
// ORCHESTRATION PIPELINE (FORM SUBMISSION)
// =============================================================
async function handleFormSubmit(event) {
    event.preventDefault();

    const destination = document.getElementById('destination').value.trim();
    if (!destination) {
        alert(t('misc.destRequired'));
        return;
    }

    const origin = document.getElementById('origin').value.trim();

    // Save for transport links
    lastTripOrigin = origin;
    lastTripDestination = destination;

    // Helper to get optional field value (null if disabled/empty)
    function getOptionalField(id) {
        const el = document.getElementById(id);
        if (!el || el.disabled) return null;
        const val = el.value.trim();
        return val === '' ? null : val;
    }

    const selected_modules = [];
    if (document.getElementById('module-roadtrip')?.checked) selected_modules.push('road_trip');
    if (document.getElementById('module-lodging')?.checked) selected_modules.push('lodging');
    if (document.getElementById('module-cuisine')?.checked) selected_modules.push('cuisine');
    if (document.getElementById('module-agenda')?.checked) selected_modules.push('agenda');

    if (selected_modules.length === 0) {
        selected_modules.push('road_trip', 'lodging', 'cuisine', 'agenda');
    }

    const roadtripActive = selected_modules.includes('road_trip');
    const lodgingActive = selected_modules.includes('lodging');
    const cuisineActive = selected_modules.includes('cuisine');
    const agendaActive = selected_modules.includes('agenda');
    const datesActive = roadtripActive || lodgingActive || agendaActive;

    const startDateEnabled = document.getElementById('enable-start-date')?.checked;
    const endDateEnabled = document.getElementById('enable-end-date')?.checked;

    const requestData = {
        destination,
        origin: roadtripActive ? (origin || null) : null,
        start_date: (datesActive && startDateEnabled) ? (document.getElementById('start_date').value || null) : null,
        end_date: (datesActive && endDateEnabled) ? (document.getElementById('end_date').value || null) : null,
        budget: lodgingActive ? getOptionalField('budget') : null,
        dietary_restrictions: cuisineActive ? getOptionalField('dietary_restrictions') : null,
        fridge_items: cuisineActive ? getOptionalField('fridge_items') : null,
        description: roadtripActive ? document.getElementById('description').value.trim() : "",
        available_hours: agendaActive ? (getOptionalField('available_hours') || 'Dia todo') : 'Dia todo',
        preferences: [],
        selected_modules: selected_modules,
    };

    if (agendaActive) {
        document.querySelectorAll('input[name="preferences"]:checked').forEach(cb => {
            requestData.preferences.push(cb.value);
        });
    }

    // Generate unique request ID to track and poll logs
    const reqId = 'req-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Transition to loading screen
    showScreen('loading-screen');
    document.querySelector('#loading-screen .loading-header h2').textContent = t('loading.title');
    document.querySelector('#loading-screen .loading-header p').textContent = t('loading.subtitle');
    const consoleStream = document.getElementById('console-stream-content');
    consoleStream.innerHTML = '';
    writeConsoleLine("Orchestrator Agent", "thinking", "Iniciando a orquestração agêntica. Analisando inputs...");

    let logPollInterval = setInterval(async () => {
        try {
            const res = await fetch(`/api/orchestrate/logs/${reqId}`);
            const logsData = await res.json();
            if (logsData.success && logsData.logs && logsData.logs.length > 0) {
                renderRealtimeLogs(logsData.logs, logsData.summary);
            }
        } catch (e) {
            console.error("Error polling realtime logs:", e);
        }
    }, 1500);

    try {
        const response = await fetch('/api/orchestrate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': reqId
            },
            body: JSON.stringify(requestData)
        });
        const data = await TripApi.readApiResponse(response);

        clearInterval(logPollInterval);

        if (data.success) {
            // Display final realtime logs summary one last time before results
            try {
                const finalLogsRes = await fetch(`/api/orchestrate/logs/${reqId}`);
                const finalLogsData = await finalLogsRes.json();
                if (finalLogsData.success) {
                    renderRealtimeLogs(finalLogsData.logs, finalLogsData.summary);
                }
            } catch (e) {}

            await animateAgentLogs(data.logs);
            fetchHistory();

            setTimeout(() => {
                document.querySelectorAll('.history-item').forEach(item => {
                    if (item.getAttribute('data-id') == data.trip_id) {
                        item.classList.add('active');
                    }
                });
            }, 500);

            showScreen('results-screen');
            currentTripId = data.trip_id;
            currentTripData = {
                id: data.trip_id,
                title: data.title,
                trip_type: data.trip_type,
                result_data: data.results,
                agent_logs: data.logs
            };
            renderResults(data.title, data.trip_type, data.results, data.logs);
        } else {
            const errCode = data.error?.code || '';
            const errMsg = data.error?.message || 'Erro desconhecido.';
            const requestSuffix = data.request_id ? `\nSolicitação: ${data.request_id}` : '';
            const displayMessage = `${errMsg}${requestSuffix}`;

            if (errCode === 'QUOTA_EXHAUSTED') {
                showOrchestrationError(
                    '⚠️ Cota da API Gemini Esgotada',
                    displayMessage,
                    'quota'
                );
            } else {
                showOrchestrationError(
                    '❌ Falha na Orquestração',
                    displayMessage,
                    'error'
                );
            }
        }
    } catch (error) {
        clearInterval(logPollInterval);
        console.error("Error orchestrating trip:", error);
        writeConsoleLine("System Core", "failed", "Falha de rede ao conectar com o servidor local.");
        alert("Falha ao se conectar com o servidor.");
        setTimeout(() => showScreen('form-screen'), 3000);
    }
}

// =============================================================
// CONSOLE ANIMATION & LOGGING
// =============================================================
function writeConsoleLine(agent, status, message) {
    const consoleStream = document.getElementById('console-stream-content');
    if (!consoleStream) return;

    let statusText = t('console.processing');
    if (status === "completed") statusText = t('console.success');
    if (status === "failed") statusText = t('console.failed');
    if (status === "warning") statusText = t('console.warning');

    const line = document.createElement('div');
    line.className = `console-line ${status}`;
    line.innerHTML = `
        <div class="console-line-header">
            <span class="console-agent-name">${escapeHtml(agent)}</span>
            <span class="console-status-badge">${statusText}</span>
        </div>
        <div class="console-msg">${escapeHtml(message)}</div>
    `;
    consoleStream.appendChild(line);
    consoleStream.scrollTop = consoleStream.scrollHeight;
}

function renderRealtimeLogs(logs, summary) {
    const consoleStream = document.getElementById('console-stream-content');
    if (!consoleStream) return;

    consoleStream.innerHTML = '';
    logs.forEach(log => {
        let statusText = log.status;
        if (log.status === "completed") statusText = "CONCLUÍDO";
        if (log.status === "failed") statusText = "FALHOU";
        if (log.status === "warning") statusText = "ALERTA";
        if (log.status === "thinking") statusText = "PROCESSANDO";
        if (log.status === "llm_call") statusText = "CHAMADA LLM";

        let costDetails = "";
        if (log.status === "llm_call") {
            const costUSD = log.cost_usd || 0;
            const inputTokens = log.input_tokens || 0;
            const outputTokens = log.output_tokens || 0;
            const durationS = ((log.duration_ms || 0) / 1000).toFixed(2);
            costDetails = `<div class="console-cost-details" style="font-size: 0.8rem; opacity: 0.7; margin-top: 4px;">
                Tokens: ${inputTokens} in / ${outputTokens} out | Custo: $${costUSD.toFixed(6)} USD | Tempo: ${durationS}s
            </div>`;
        }

        const line = document.createElement('div');
        line.className = `console-line ${log.status}`;
        line.innerHTML = `
            <div class="console-line-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span class="console-agent-name" style="font-weight: 600; color: #a5b4fc;">${escapeHtml(log.agent)}</span>
                <span class="console-status-badge badge badge-${log.status === 'completed' ? 'success' : log.status === 'failed' ? 'danger' : 'indigo'}" style="font-size: 0.75rem;">${statusText}</span>
            </div>
            <div class="console-msg" style="margin-top: 4px; opacity: 0.95;">${escapeHtml(log.message)}</div>
            ${costDetails}
        `;
        consoleStream.appendChild(line);
    });

    if (summary && (summary.total_input_tokens > 0 || summary.total_cost_usd > 0)) {
        const totalDurationS = ((summary.total_duration_ms || 0) / 1000).toFixed(2);
        const summaryLine = document.createElement('div');
        summaryLine.className = 'console-line summary';
        summaryLine.style = 'border-top: 1px solid rgba(255,255,255,0.15); margin-top: 12px; padding-top: 8px; font-weight: bold; color: #38bdf8;';
        summaryLine.innerHTML = `
            <div style="font-size: 0.85rem;">
                <i data-lucide="calculator" class="icon-small" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 4px;"></i>
                Acumulado do Roteiro:
            </div>
            <div style="font-size: 0.8rem; opacity: 0.85; font-weight: normal; margin-top: 4px; line-height: 1.4;">
                Tokens Totais: ${summary.total_input_tokens + summary.total_output_tokens} (In: ${summary.total_input_tokens} / Out: ${summary.total_output_tokens})<br>
                Tempo em LLM: ${totalDurationS}s | Custo Estimado: $${summary.total_cost_usd.toFixed(5)} USD
            </div>
        `;
        consoleStream.appendChild(summaryLine);
        if (window.lucide) window.lucide.createIcons();
    }

    consoleStream.scrollTop = consoleStream.scrollHeight;
}

function showOrchestrationError(title, message, type) {
    const heading = document.querySelector('#loading-screen .loading-header h2');
    const subtitle = document.querySelector('#loading-screen .loading-header p');
    if (heading) heading.textContent = title;
    if (subtitle) subtitle.textContent = message;
    writeConsoleLine('System Core', type === 'quota' ? 'warning' : 'failed', message);
}

async function animateAgentLogs(logs) {
    const consoleStream = document.getElementById('console-stream-content');
    consoleStream.innerHTML = '';
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        writeConsoleLine(log.agent, log.status, log.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function toggleTabPlaceholder(tabId, isPresent, moduleName, tripId) {
    const tabEl = document.getElementById(tabId);
    if (!tabEl) return;

    // Find the split-view (which is the actual content)
    const splitView = tabEl.querySelector('.split-view');

    // Check if we already have a placeholder in this tab
    let placeholder = tabEl.querySelector('.module-placeholder');

    if (isPresent) {
        if (splitView) splitView.style.display = '';
        if (placeholder) placeholder.style.display = 'none';
    } else {
        if (splitView) splitView.style.display = 'none';

        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.className = 'module-placeholder glass-card';
            placeholder.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 48px 24px;
                margin: 24px auto;
                max-width: 600px;
                gap: 20px;
                border: 1px dashed rgba(255,255,255,0.15);
                background: rgba(30, 41, 59, 0.4);
                backdrop-filter: blur(12px);
                border-radius: 16px;
            `;
            tabEl.appendChild(placeholder);
        }

        placeholder.style.display = 'flex';

        // Define module icon and title based on moduleName
        let iconName = 'help-circle';
        let moduleTitle = '';
        let moduleDesc = '';
        let btnText = '';

        if (moduleName === 'road_trip') {
            iconName = 'milestone';
            moduleTitle = 'Rota & Mapa não calculado';
            moduleDesc = 'O agente de Road Trip e Geolocalização não foi executado para este roteiro.';
            btnText = 'Gerar Rota & Mapa';
        } else if (moduleName === 'cuisine') {
            iconName = 'utensils-cross';
            moduleTitle = 'Gastronomia não calculada';
            moduleDesc = 'O agente especialista em Gastronomia e Restaurantes locais não foi executado.';
            btnText = 'Gerar Gastronomia';
        } else if (moduleName === 'lodging') {
            iconName = 'hotel';
            moduleTitle = 'Hospedagem & Clima não calculado';
            moduleDesc = 'Os agentes de Hospedagem, Transporte e Clima não foram executados.';
            btnText = 'Gerar Hospedagem & Clima';
        } else if (moduleName === 'agenda') {
            iconName = 'calendar-days';
            moduleTitle = 'Atividades & Eventos não calculado';
            moduleDesc = 'O agente especialista em Atrações Turísticas e Agenda Diária não foi executado.';
            btnText = 'Gerar Atividades & Eventos';
        }

        placeholder.innerHTML = `
            <div class="placeholder-icon-wrapper" style="
                background: rgba(99, 102, 241, 0.1);
                color: #6366f1;
                width: 64px;
                height: 64px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgba(99, 102, 241, 0.2);
            ">
                <i data-lucide="${iconName}" style="width: 32px; height: 32px;"></i>
            </div>
            <h3 style="font-size: 1.35rem; font-weight: 600; margin: 0; color: #f8fafc;">${moduleTitle}</h3>
            <p style="font-size: 0.95rem; color: #94a3b8; margin: 0; max-width: 420px; line-height: 1.5;">${moduleDesc}</p>
            <button class="btn-primary calculate-module-btn" data-module="${moduleName}" data-trip-id="${tripId}" style="
                padding: 10px 24px;
                font-weight: 550;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
            ">
                <i data-lucide="play" style="width: 16px; height: 16px;"></i>
                <span>${btnText}</span>
            </button>
        `;

        // Re-run lucide icons helper so the new icons render
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Add click listener
        const btn = placeholder.querySelector('.calculate-module-btn');
        btn.addEventListener('click', () => runSubsequentModule(moduleName, tripId));
    }
}

async function runSubsequentModule(moduleName, tripId) {
    if (!tripId) {
        alert("ID da viagem não encontrado.");
        return;
    }

    const reqId = 'req-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Transition to loading screen
    showScreen('loading-screen');

    // Set headers
    const heading = document.querySelector('#loading-screen .loading-header h2');
    const subtitle = document.querySelector('#loading-screen .loading-header p');
    if (heading) heading.textContent = "Calculando Módulo Adicional...";
    if (subtitle) subtitle.textContent = "Nossos sub-agentes inteligentes estão processando o novo módulo solicitado.";

    const consoleStream = document.getElementById('console-stream-content');
    if (consoleStream) consoleStream.innerHTML = '';
    writeConsoleLine("Orchestrator Agent", "thinking", `Disparando especialista para o módulo: ${moduleName}...`);

    let logPollInterval = setInterval(async () => {
        try {
            const res = await fetch(`/api/orchestrate/logs/${reqId}`);
            const logsData = await res.json();
            if (logsData.success && logsData.logs && logsData.logs.length > 0) {
                renderRealtimeLogs(logsData.logs, logsData.summary);
            }
        } catch (e) {
            console.error("Error polling realtime logs:", e);
        }
    }, 1500);

    try {
        const response = await fetch(`/api/trip/${tripId}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Request-ID': reqId
            },
            body: JSON.stringify({ modules: [moduleName] })
        });
        const data = await TripApi.readApiResponse(response);

        clearInterval(logPollInterval);

        if (data.success) {
            // Display final realtime logs summary one last time before results
            try {
                const finalLogsRes = await fetch(`/api/orchestrate/logs/${reqId}`);
                const finalLogsData = await finalLogsRes.json();
                if (finalLogsData.success) {
                    renderRealtimeLogs(finalLogsData.logs, finalLogsData.summary);
                }
            } catch (e) {}

            await animateAgentLogs(data.logs);
            fetchHistory();

            currentTripId = data.trip_id;
            currentTripData = {
                id: data.trip_id,
                title: data.title,
                trip_type: data.trip_type,
                result_data: data.results,
                agent_logs: data.logs
            };

            showScreen('results-screen');
            renderResults(data.title, data.trip_type, data.results, data.logs);

            // Switch to the newly calculated tab
            let tabId = 'tab-traces';
            if (moduleName === 'road_trip') tabId = 'tab-map';
            else if (moduleName === 'cuisine') tabId = 'tab-cuisine';
            else if (moduleName === 'lodging') tabId = 'tab-logistics';
            else if (moduleName === 'agenda') tabId = 'tab-agenda';

            setTimeout(() => {
                const activeTabLink = document.querySelector(`.tab-link[data-tab="${tabId}"]`);
                if (activeTabLink) activeTabLink.click();
            }, 100);

        } else {
            const errCode = data.error?.code || '';
            const errMsg = data.error?.message || 'Erro desconhecido.';
            const requestSuffix = data.request_id ? `\nSolicitação: ${data.request_id}` : '';
            const displayMessage = `${errMsg}${requestSuffix}`;

            if (errCode === 'QUOTA_EXHAUSTED') {
                showOrchestrationError(
                    '⚠️ Cota da API Gemini Esgotada',
                    displayMessage,
                    'quota'
                );
            } else {
                showOrchestrationError(
                    '❌ Falha no Cálculo do Módulo',
                    displayMessage,
                    'error'
                );
            }
        }
    } catch (error) {
        clearInterval(logPollInterval);
        console.error("Error calculating subsequent module:", error);
        writeConsoleLine("System Core", "failed", "Falha de rede ao conectar com o servidor local.");
        alert("Falha ao se conectar com o servidor.");
        setTimeout(() => showScreen('results-screen'), 3000);
    }
}

// =============================================================
// RENDER ITINERARY RESULTS
// =============================================================
function renderResults(title, type, results, logs) {
    document.getElementById('result-trip-title').innerText = title;

    // Calculate total cost and tokens from final logs
    let totalCostUSD = 0;
    let totalTokens = 0;
    let hasCosts = false;

    if (logs && Array.isArray(logs)) {
        logs.forEach(log => {
            if (log.cost_usd !== undefined && log.cost_usd !== null) {
                totalCostUSD += log.cost_usd;
                hasCosts = true;
            }
            if (log.input_tokens !== undefined && log.input_tokens !== null) {
                totalTokens += log.input_tokens;
            }
            if (log.output_tokens !== undefined && log.output_tokens !== null) {
                totalTokens += log.output_tokens;
            }
        });
    }

    const costBadge = document.getElementById('badge-trip-cost');
    const costText = document.getElementById('trip-cost-text');
    if (costBadge && costText) {
        if (hasCosts && totalCostUSD > 0) {
            costText.innerText = `Custo: $${totalCostUSD.toFixed(5)} USD | Tokens: ${totalTokens}`;
            costBadge.style.display = '';
        } else {
            costBadge.style.display = 'none';
        }
    }

    if (window.showDefaultCuisineView) window.showDefaultCuisineView();
    const typeBadge = document.getElementById('badge-trip-type');
    typeBadge.innerText = translateType(type);
    typeBadge.className = `badge badge-${type === 'roadtrip' ? 'indigo' : type === 'business' ? 'cyan' : 'amber'}`;

    const hasRoadTrip = !!results.location;
    const hasCuisine = !!results.cuisine;
    const hasLogistics = !!results.logistics;
    const hasAgenda = !!results.events;

    // Keep all tab links visible
    const tabMapLink = document.querySelector('.tab-link[data-tab="tab-map"]');
    if (tabMapLink) tabMapLink.style.display = '';

    const tabCuisineLink = document.querySelector('.tab-link[data-tab="tab-cuisine"]');
    if (tabCuisineLink) tabCuisineLink.style.display = '';

    const tabLogisticsLink = document.querySelector('.tab-link[data-tab="tab-logistics"]');
    if (tabLogisticsLink) tabLogisticsLink.style.display = '';

    const tabAgendaLink = document.querySelector('.tab-link[data-tab="tab-agenda"]');
    if (tabAgendaLink) tabAgendaLink.style.display = '';

    // Apply placeholders if modules are not yet calculated
    toggleTabPlaceholder('tab-map', hasRoadTrip, 'road_trip', currentTripId);
    toggleTabPlaceholder('tab-cuisine', hasCuisine, 'cuisine', currentTripId);
    toggleTabPlaceholder('tab-logistics', hasLogistics, 'lodging', currentTripId);
    toggleTabPlaceholder('tab-agenda', hasAgenda, 'agenda', currentTripId);

    // Pick first active tab (prefer calculated ones)
    let defaultTab = 'tab-traces';
    if (hasRoadTrip) defaultTab = 'tab-map';
    else if (hasCuisine) defaultTab = 'tab-cuisine';
    else if (hasLogistics) defaultTab = 'tab-logistics';
    else if (hasAgenda) defaultTab = 'tab-agenda';

    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    const activeTabLink = document.querySelector(`.tab-link[data-tab="${defaultTab}"]`);
    if (activeTabLink) activeTabLink.classList.add('active');

    const activeTabContent = document.getElementById(defaultTab);
    if (activeTabContent) activeTabContent.classList.add('active');

    // 1. MAP & ROUTE
    const locData = results.location;
    if (locData) {
        document.getElementById('route-distance').innerText = locData.distance_km || "-";
        document.getElementById('route-duration').innerText = locData.estimated_duration || "-";
        renderRouteNodes(locData.route_nodes);
        setupLeafletMap(locData.map_center, locData.route_nodes);
    } else {
        document.getElementById('route-distance').innerText = "-";
        document.getElementById('route-duration').innerText = "-";
        document.getElementById('route-nodes-list').innerHTML = `<p class='suggestions-text'>${t('misc.noGeoData')}</p>`;
        clearMap();
    }
    renderSources('location-sources', locData ? locData.sources : null);

    // 2. CUISINE
    const cuisineData = results.cuisine;
    if (cuisineData) {
        renderTypicalDishes(cuisineData.typical_dishes);
        renderRestaurantRanking(cuisineData.restaurant_ranking);
        renderSubtabShopping(cuisineData.shopping_list, cuisineData.estimated_shopping_cost);
        if (cuisineData.typical_dishes && cuisineData.typical_dishes.length > 0) {
            lastSelectedDish = cuisineData.typical_dishes[0];
            showDishDetails(cuisineData.typical_dishes[0]);
        }
    } else {
        document.getElementById('typical-dishes-list').innerHTML = "";
        document.getElementById('restaurant-ranking-list').innerHTML = "";
    }
    renderSources('cuisine-sources', cuisineData ? cuisineData.sources : null);

    // 3. LOGISTICS & WEATHER
    const logData = results.logistics;
    const weatherData = results.weather;
    if (window.showDefaultLogisticsView) window.showDefaultLogisticsView();

    if (logData) {
        renderLodging(logData.lodging_suggestions);
        renderTransit(logData.transit_options);
    } else {
        document.getElementById('lodging-list').innerHTML = "";
        document.getElementById('transit-list').innerHTML = "";
    }

    if (weatherData) {
        renderWeather(weatherData.forecast);
        document.getElementById('clothing-suggestions-p').innerText = weatherData.clothing_suggestions || "Sem sugestões.";
        renderPackingChecklist(weatherData.packing_checklist);
    } else {
        document.getElementById('weather-forecast-row').innerHTML = "";
        document.getElementById('clothing-suggestions-p').innerText = "";
        document.getElementById('packing-checklist-list').innerHTML = "";
    }

    let logSources = [];
    if (logData && logData.sources) logSources = logSources.concat(logData.sources);
    if (weatherData && weatherData.sources) logSources = logSources.concat(weatherData.sources);
    logSources = [...new Set(logSources)];
    renderSources('logistics-sources', logSources);

    // 4. EVENTS & AGENDA
    const evData = results.events;
    if (window.showDefaultAgendaView) window.showDefaultAgendaView();
    if (evData) {
        renderSightseeing(evData.sightseeing);
        renderEvents(evData.events);
        renderAgenda(evData.daily_agenda);
        const checkUl = document.getElementById('travel-checklist-ul');
        checkUl.innerHTML = '';
        evData.travel_checklist.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i data-lucide="check-square" class="checklist-icon"></i> <span>${escapeHtml(item)}</span>`;
            checkUl.appendChild(li);
        });
    } else {
        document.getElementById('sightseeing-list').innerHTML = "";
        document.getElementById('events-list').innerHTML = "";
        document.getElementById('daily-agenda-timeline').innerHTML = "";
        document.getElementById('travel-checklist-ul').innerHTML = "";
    }
    renderSources('agenda-sources', evData ? evData.sources : null);

    // 5. AGENT TRACES
    renderAgentTraces(logs, results);

    lucide.createIcons();
}

// =============================================================
// SUB-RENDERERS
// =============================================================
function renderRouteNodes(nodes) {
    const list = document.getElementById('route-nodes-list');
    list.innerHTML = '';
    if (!nodes || nodes.length === 0) return;

    nodes.forEach((node, index) => {
        const el = document.createElement('div');
        let nodeClass = 'timeline-node';
        if (index === 0) nodeClass += ' origin-node';
        else if (index === nodes.length - 1) nodeClass += ' destination-node';

        el.className = nodeClass;
        el.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${escapeHtml(node.name)}</h4>
                <p>${escapeHtml(node.description)}</p>
            </div>
        `;
        list.appendChild(el);
    });
}

function renderTypicalDishes(dishes) {
    const list = document.getElementById('typical-dishes-list');
    list.innerHTML = '';
    if (!dishes) return;

    dishes.forEach((dish, idx) => {
        const el = document.createElement('div');
        el.className = 'dish-card' + (idx === 0 ? ' active' : '');
        el.innerHTML = `
            <h4>${escapeHtml(dish.name)}</h4>
            <p>${escapeHtml(dish.description)}</p>
        `;
        el.addEventListener('click', () => {
            document.querySelectorAll('#typical-dishes-list .dish-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            showDishDetails(dish);
        });
        list.appendChild(el);
    });
}

window.showDishDetails = function(dish) {
    lastSelectedDish = dish;

    const dishPanel = document.getElementById('cuisine-dish-detail-panel');
    const recipePanel = document.getElementById('cuisine-dish-recipe-panel');
    const mapPanel = document.getElementById('cuisine-restaurant-map-panel');
    const menuPanel = document.getElementById('cuisine-menu-panel');

    if (dishPanel) dishPanel.style.display = 'block';
    if (recipePanel) recipePanel.style.display = 'block';
    if (mapPanel) mapPanel.style.display = 'none';
    if (menuPanel) menuPanel.style.display = 'none';

    if (restaurantMapInstance) { restaurantMapInstance.remove(); restaurantMapInstance = null; }

    const nameEl = document.getElementById('cuisine-dish-name');
    if (nameEl) nameEl.innerText = dish.name;

    const histEl = document.getElementById('cuisine-dish-history');
    if (histEl) histEl.innerText = dish.history || "Histórico não disponível.";

    const photoEl = document.getElementById('cuisine-dish-photo');
    if (photoEl) {
        TripMedia.applyMediaAsset(photoEl, document.getElementById('cuisine-dish-photo-attribution'), dish.media, `Imagem de ${dish.name}`);
    }

    const tagsEl = document.getElementById('cuisine-dish-dietary-tags');
    if (tagsEl) {
        tagsEl.innerHTML = '';
        if (dish.dietary_tags && dish.dietary_tags.length > 0) {
            dish.dietary_tags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'dietary-tag';
                span.innerText = tag;
                tagsEl.appendChild(span);
            });
        } else {
            tagsEl.innerHTML = '<span class="dietary-tag" style="background:rgba(255,255,255,0.03);color:var(--text-dark);border-color:transparent;">Livre</span>';
        }
    }

    const ingsEl = document.getElementById('cuisine-recipe-ingredients');
    if (ingsEl) {
        ingsEl.innerHTML = '';
        (dish.ingredients || []).forEach(ing => {
            const li = document.createElement('li');
            li.innerText = ing;
            ingsEl.appendChild(li);
        });
    }

    const stepsEl = document.getElementById('cuisine-recipe-steps');
    if (stepsEl) {
        stepsEl.innerHTML = '';
        (dish.recipe_steps || []).forEach((step, idx) => {
            const li = document.createElement('li');
            li.setAttribute('data-step', `${idx + 1}.`);
            li.innerText = step;
            stepsEl.appendChild(li);
        });
    }

    switchCuisineSubTab('recipe');
    lucide.createIcons();
};

window.switchCuisineSubTab = function(subtab) {
    const btnRecipe = document.getElementById('btn-subtab-recipe');
    const btnShopping = document.getElementById('btn-subtab-shopping');
    const contentRecipe = document.getElementById('cuisine-subtab-recipe');
    const contentShopping = document.getElementById('cuisine-subtab-shopping');

    if (subtab === 'recipe') {
        if (btnRecipe) btnRecipe.classList.add('active');
        if (btnShopping) btnShopping.classList.remove('active');
        if (contentRecipe) contentRecipe.classList.add('active');
        if (contentShopping) contentShopping.classList.remove('active');
    } else {
        if (btnRecipe) btnRecipe.classList.remove('active');
        if (btnShopping) btnShopping.classList.add('active');
        if (contentRecipe) contentRecipe.classList.remove('active');
        if (contentShopping) contentShopping.classList.add('active');
    }
};

window.renderSubtabShopping = function(shoppingList, estimatedCost) {
    const costEl = document.getElementById('cuisine-shopping-cost');
    if (costEl) costEl.innerText = estimatedCost || "R$ 0";

    const shopUl = document.getElementById('cuisine-shopping-list-ul');
    if (shopUl) {
        shopUl.innerHTML = '';
        if (shoppingList && shoppingList.length > 0) {
            shoppingList.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<i data-lucide="shopping-cart" class="checklist-icon"></i> <span>${escapeHtml(item)}</span>`;
                shopUl.appendChild(li);
            });
        } else {
            shopUl.innerHTML = `<li><i data-lucide="check-circle" class="checklist-icon" style="color:var(--color-emerald);"></i> <span>${t('cuisine.noIngredients')}</span></li>`;
        }
    }
    lucide.createIcons();
};

function renderRestaurantRanking(rests) {
    const list = document.getElementById('restaurant-ranking-list');
    list.innerHTML = '';
    if (!rests) return;

    rests.forEach((rest, idx) => {
        const el = document.createElement('div');
        el.className = 'restaurant-card';
        el.innerHTML = `
            <div class="rest-info" style="flex-grow: 1;">
                <h4>${idx + 1}. ${escapeHtml(rest.name)}</h4>
                <div class="rest-meta">
                    <span><i data-lucide="tag" class="icon-small"></i> ${escapeHtml(rest.cuisine_type)}</span>
                    <span><i data-lucide="star" class="icon-small"></i> ${escapeHtml(rest.rating)}</span>
                    <span><i data-lucide="dollar-sign" class="icon-small"></i> ${escapeHtml(rest.price_tier)}</span>
                </div>
                <p class="rest-desc" style="margin-bottom: 8px;">${escapeHtml(rest.description)}</p>
                <button class="btn-secondary btn-small btn-view-rest-details" style="gap: 6px; display: inline-flex; align-items: center;">
                    <i data-lucide="map-pin" class="icon-small"></i> ${t('cuisine.viewMapMenu')}
                </button>
            </div>
            <div class="rest-badge" style="flex-shrink: 0; margin-left: 10px;">${t('cuisine.recommended')}</div>
        `;
        el.querySelector('.btn-view-rest-details').addEventListener('click', () => showRestaurantMapAndMenu(rest));
        list.appendChild(el);
    });
    lucide.createIcons();
}

window.showDefaultCuisineView = function() {
    if (lastSelectedDish) {
        showDishDetails(lastSelectedDish);
    } else {
        const dishPanel = document.getElementById('cuisine-dish-detail-panel');
        const recipePanel = document.getElementById('cuisine-dish-recipe-panel');
        const mapPanel = document.getElementById('cuisine-restaurant-map-panel');
        const menuPanel = document.getElementById('cuisine-menu-panel');
        if (dishPanel) dishPanel.style.display = 'block';
        if (recipePanel) recipePanel.style.display = 'block';
        if (mapPanel) mapPanel.style.display = 'none';
        if (menuPanel) menuPanel.style.display = 'none';
        if (restaurantMapInstance) { restaurantMapInstance.remove(); restaurantMapInstance = null; }
    }
};

window.showRestaurantMapAndMenu = function(rest) {
    const dishPanel = document.getElementById('cuisine-dish-detail-panel');
    const recipePanel = document.getElementById('cuisine-dish-recipe-panel');
    const mapPanel = document.getElementById('cuisine-restaurant-map-panel');
    const menuPanel = document.getElementById('cuisine-menu-panel');

    if (dishPanel) dishPanel.style.display = 'none';
    if (recipePanel) recipePanel.style.display = 'none';
    if (mapPanel) mapPanel.style.display = 'block';
    if (menuPanel) menuPanel.style.display = 'block';

    const mapTitle = document.getElementById('cuisine-map-restaurant-name');
    if (mapTitle) mapTitle.innerText = rest.name;

    const urlContainer = document.getElementById('restaurant-detail-url-container');
    const linkEl = document.getElementById('restaurant-detail-link');
    if (urlContainer && linkEl) {
        if (rest.url) {
            linkEl.href = rest.url;
            urlContainer.style.display = 'block';
        } else {
            urlContainer.style.display = 'none';
        }
    }

    const accordion = document.getElementById('restaurant-menu-accordion');
    if (accordion) {
        accordion.innerHTML = '';
        if (rest.menu && rest.menu.length > 0) {
            rest.menu.forEach(item => {
                let name = typeof item === 'string' ? item : (item?.name || "Prato");
                let price = typeof item === 'object' ? (item?.price || "") : "S/P";
                let desc = typeof item === 'object' ? (item?.description || "Sem descrição disponível.") : "Detalhes não disponíveis.";

                const div = document.createElement('div');
                div.className = 'accordion-item';
                div.innerHTML = `
                    <div class="accordion-header" onclick="toggleAccordionItem(this)">
                        <div class="accordion-title-box">
                            <span class="accordion-title">${escapeHtml(name)}</span>
                        </div>
                        <div class="accordion-title-box">
                            <span class="accordion-price">${escapeHtml(price)}</span>
                            <i data-lucide="chevron-down" style="width:14px; height:14px; margin-left:8px;"></i>
                        </div>
                    </div>
                    <div class="accordion-content">${escapeHtml(desc)}</div>
                `;
                accordion.appendChild(div);
            });
        } else {
            accordion.innerHTML = `<div class="suggestions-text">${t('cuisine.noMenu')}</div>`;
        }
    }
    lucide.createIcons();

    if (restaurantMapInstance) { restaurantMapInstance = null; }

    const mapContainer = document.getElementById('restaurant-map');
    if (!mapContainer) return;

    if (!rest.lat || !rest.lng || isNaN(rest.lat) || isNaN(rest.lng)) {
        mapContainer.innerHTML = `<div class="suggestions-text" style="padding:40px 20px;text-align:center;color:var(--text-dark);">${t('misc.noRestCoords')}</div>`;
        lucide.createIcons();
        return;
    }

    try {
        if (typeof google === 'undefined' || !google.maps) {
            mapContainer.innerHTML = `<div style="padding:20px;text-align:center;color:white;">Google Maps API não carregada.</div>`;
            return;
        }
        restaurantMapInstance = new google.maps.Map(mapContainer, {
            center: { lat: parseFloat(rest.lat), lng: parseFloat(rest.lng) },
            zoom: 15,
            disableDefaultUI: true
        });
        const marker = new google.maps.Marker({
            position: { lat: parseFloat(rest.lat), lng: parseFloat(rest.lng) },
            map: restaurantMapInstance,
            title: rest.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#F59E0B',
                fillOpacity: 1,
                strokeColor: '#151D30',
                strokeWeight: 2
            }
        });
        const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${escapeHtml(rest.name)}</strong><br><span style="font-size:11px;color:#94a3b8;">${escapeHtml(rest.description)}</span>`
        });
        infoWindow.open(restaurantMapInstance, marker);
        marker.addListener('click', () => infoWindow.open(restaurantMapInstance, marker));
    } catch (e) { console.error("Failed to render restaurant map:", e); }
};

window.toggleAccordionItem = function(header) {
    const item = header.parentElement;
    const isExpanded = item.classList.contains('expanded');
    document.querySelectorAll('#restaurant-menu-accordion .accordion-item').forEach(el => el.classList.remove('expanded'));
    if (!isExpanded) item.classList.add('expanded');
};

// ----- PACKING CHECKLIST (text only, no images) -----
function renderPackingChecklist(items) {
    const listEl = document.getElementById('packing-checklist-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!items || items.length === 0) return;

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'packing-text-item';
        li.innerHTML = `
            <span class="packing-check-icon"><i data-lucide="square" class="icon-small"></i></span>
            <div class="packing-text-info">
                <span class="packing-text-name">${escapeHtml(item.name)}</span>
                <span class="packing-text-reason">${escapeHtml(item.reason)}</span>
            </div>
            <span class="packing-text-qty">${item.quantity}x</span>
        `;
        li.addEventListener('click', () => {
            const isPacked = li.classList.toggle('packed');
            const iconEl = li.querySelector('[data-lucide]');
            if (iconEl) iconEl.setAttribute('data-lucide', isPacked ? 'check-square' : 'square');
            lucide.createIcons();
        });
        listEl.appendChild(li);
    });
    lucide.createIcons();
}

// ----- LODGING -----
function renderLodging(hotels) {
    const list = document.getElementById('lodging-list');
    list.innerHTML = '';
    if (!hotels) return;

    hotels.forEach(hotel => {
        const el = document.createElement('div');
        el.className = 'lodging-card';
        el.innerHTML = `
            <h4>${escapeHtml(hotel.name)}</h4>
            <div class="lodging-meta">
                <span class="lodging-rating"><i data-lucide="star" class="icon-small"></i> ${escapeHtml(hotel.rating)}</span>
                <span class="lodging-price">${escapeHtml(hotel.price_range)}</span>
            </div>
            <p>${escapeHtml(hotel.description)}</p>
        `;
        el.addEventListener('click', () => {
            document.querySelectorAll('#lodging-list .lodging-card').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            showHotelDetails(hotel);
        });
        list.appendChild(el);
    });
    lucide.createIcons();
}

window.showHotelDetails = function(hotel) {
    if (!hotel) return;
    lastSelectedHotel = hotel;

    const weatherPanel = document.getElementById('logistics-weather-panel');
    const packingPanel = document.getElementById('logistics-packing-panel');
    const hotelDetailPanel = document.getElementById('logistics-hotel-detail-panel');
    const hotelMapPanel = document.getElementById('logistics-hotel-map-panel');

    if (weatherPanel) weatherPanel.style.display = 'none';
    if (packingPanel) packingPanel.style.display = 'none';
    if (hotelDetailPanel) hotelDetailPanel.style.display = 'block';
    if (hotelMapPanel) hotelMapPanel.style.display = 'block';

    const nameEl = document.getElementById('hotel-detail-name');
    if (nameEl) nameEl.innerText = hotel.name;
    const ratingEl = document.getElementById('hotel-detail-rating');
    if (ratingEl) ratingEl.innerHTML = `<i data-lucide="star" class="icon-small"></i> ${escapeHtml(hotel.rating || 'N/A')}`;
    const priceEl = document.getElementById('hotel-detail-price');
    if (priceEl) priceEl.innerText = hotel.price_range || '';
    const descEl = document.getElementById('hotel-detail-description');
    if (descEl) descEl.innerText = hotel.description || '';

    const urlContainer = document.getElementById('hotel-detail-url-container');
    const linkEl = document.getElementById('hotel-detail-link');
    if (urlContainer && linkEl) {
        if (hotel.url) {
            linkEl.href = hotel.url;
            urlContainer.style.display = 'block';
        } else {
            urlContainer.style.display = 'none';
        }
    }

    const photoEl = document.getElementById('hotel-detail-photo');
    if (photoEl) TripMedia.applyMediaAsset(photoEl, document.getElementById('hotel-detail-photo-attribution'), hotel.media, `Imagem de ${hotel.name}`);

    const amenitiesEl = document.getElementById('hotel-detail-amenities');
    if (amenitiesEl) {
        amenitiesEl.innerHTML = '';
        if (hotel.amenities && hotel.amenities.length > 0) {
            hotel.amenities.forEach(am => {
                const span = document.createElement('span');
                span.className = 'dietary-tag';
                span.innerText = am;
                amenitiesEl.appendChild(span);
            });
        } else {
            amenitiesEl.innerHTML = `<span class="dietary-tag" style="background:rgba(255,255,255,0.03);color:var(--text-dark);border-color:transparent;">${t('misc.notInformed')}</span>`;
        }
    }

    const roomsEl = document.getElementById('hotel-detail-rooms');
    if (roomsEl) {
        roomsEl.innerHTML = '';
        if (hotel.room_types && hotel.room_types.length > 0) {
            hotel.room_types.forEach(room => {
                const li = document.createElement('li');
                li.innerText = room;
                roomsEl.appendChild(li);
            });
        } else {
            roomsEl.innerHTML = `<li>${t('misc.roomsOnRequest')}</li>`;
        }
    }

    lucide.createIcons();

    if (hotelMapInstance) { hotelMapInstance = null; }

    const mapContainer = document.getElementById('hotel-map');
    if (!hotel.lat || !hotel.lng || isNaN(hotel.lat) || isNaN(hotel.lng)) {
        if (mapContainer) mapContainer.innerHTML = `<div class="suggestions-text" style="padding:40px 20px;text-align:center;">${t('logistics.noCoords')}</div>`;
        lucide.createIcons();
        return;
    }

    try {
        if (typeof google === 'undefined' || !google.maps) {
            if (mapContainer) mapContainer.innerHTML = `<div style="padding:20px;text-align:center;color:white;">Google Maps API não carregada.</div>`;
            return;
        }
        hotelMapInstance = new google.maps.Map(mapContainer, {
            center: { lat: parseFloat(hotel.lat), lng: parseFloat(hotel.lng) },
            zoom: 15,
            disableDefaultUI: true
        });
        const marker = new google.maps.Marker({
            position: { lat: parseFloat(hotel.lat), lng: parseFloat(hotel.lng) },
            map: hotelMapInstance,
            title: hotel.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#6366F1',
                fillOpacity: 1,
                strokeColor: '#151D30',
                strokeWeight: 2
            }
        });
        const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${escapeHtml(hotel.name)}</strong><br><span style="font-size:11px;color:#94a3b8;">${escapeHtml(hotel.description || '')}</span>`
        });
        infoWindow.open(hotelMapInstance, marker);
        marker.addListener('click', () => infoWindow.open(hotelMapInstance, marker));
    } catch (e) { console.error("Failed to render hotel map:", e); }
};

window.showDefaultLogisticsView = function() {
    const weatherPanel = document.getElementById('logistics-weather-panel');
    const packingPanel = document.getElementById('logistics-packing-panel');
    const hotelDetailPanel = document.getElementById('logistics-hotel-detail-panel');
    const hotelMapPanel = document.getElementById('logistics-hotel-map-panel');

    if (weatherPanel) weatherPanel.style.display = 'block';
    if (packingPanel) packingPanel.style.display = 'block';
    if (hotelDetailPanel) hotelDetailPanel.style.display = 'none';
    if (hotelMapPanel) hotelMapPanel.style.display = 'none';

    document.querySelectorAll('#lodging-list .lodging-card').forEach(c => c.classList.remove('active'));
    if (hotelMapInstance) { hotelMapInstance = null; }
};

// ----- TRANSIT with reference links -----
function renderTransit(options) {
    const list = document.getElementById('transit-list');
    list.innerHTML = '';
    if (!options) return;

    // Show/update reference links
    const refLinksEl = document.getElementById('transit-ref-links');
    const gmapsLink = document.getElementById('transit-link-gmaps');
    const rome2rioLink = document.getElementById('transit-link-rome2rio');

    if (lastTripOrigin && lastTripDestination) {
        const encOrigin = encodeURIComponent(lastTripOrigin);
        const encDest = encodeURIComponent(lastTripDestination);
        if (gmapsLink) gmapsLink.href = `https://www.google.com/maps/dir/${encOrigin}/${encDest}`;
        if (rome2rioLink) rome2rioLink.href = `https://www.rome2rio.com/map/${encOrigin}/${encDest}`;
        if (refLinksEl) refLinksEl.style.display = 'flex';
    } else if (lastTripDestination) {
        const encDest = encodeURIComponent(lastTripDestination);
        if (gmapsLink) gmapsLink.href = `https://www.google.com/maps/search/${encDest}`;
        if (rome2rioLink) rome2rioLink.href = `https://www.rome2rio.com/map/${encDest}`;
        if (refLinksEl) refLinksEl.style.display = 'flex';
    } else {
        if (refLinksEl) refLinksEl.style.display = 'none';
    }

    options.forEach(opt => {
        const el = document.createElement('div');
        el.className = 'transit-item';

        let icon = 'car';
        const typeLower = opt.type.toLowerCase();
        if (typeLower.includes('voo') || typeLower.includes('flight') || typeLower.includes('avi')) icon = 'plane';
        else if (typeLower.includes('ônibus') || typeLower.includes('bus') || typeLower.includes('onibus')) icon = 'bus';
        else if (typeLower.includes('trem') || typeLower.includes('metrô') || typeLower.includes('metro') || typeLower.includes('train')) icon = 'train-front';
        else if (typeLower.includes('barco') || typeLower.includes('ferry') || typeLower.includes('navio')) icon = 'ship';
        else if (typeLower.includes('taxi') || typeLower.includes('uber') || typeLower.includes('ride')) icon = 'car-taxi-front';

        el.innerHTML = `
            <div class="transit-info">
                <strong><i data-lucide="${icon}" class="icon-small"></i> ${escapeHtml(opt.type)}</strong>
                <span>${escapeHtml(opt.details)}</span>
            </div>
            <span class="transit-cost">${escapeHtml(opt.estimated_cost)}</span>
        `;
        list.appendChild(el);
    });
    lucide.createIcons();
}

function renderSources(elementId, sources) {
    const panel = document.getElementById(elementId + '-panel');
    const list = document.getElementById(elementId + '-list');
    if (!panel || !list) return;

    if (sources && Array.isArray(sources) && sources.length > 0) {
        list.innerHTML = '';
        sources.forEach(src => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '8px';
            li.style.padding = '4px 0';

            const link = document.createElement('a');
            link.href = src;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.style.color = 'var(--color-primary)';
            link.style.textDecoration = 'none';
            link.style.fontSize = '0.85rem';
            link.style.display = 'inline-flex';
            link.style.alignItems = 'center';
            link.style.gap = '6px';
            link.style.wordBreak = 'break-all';

            link.innerHTML = `<i data-lucide="external-link" style="width: 12px; height: 12px; flex-shrink: 0;"></i> ${escapeHtml(src)}`;
            li.appendChild(link);
            list.appendChild(li);
        });
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
        list.innerHTML = '';
    }
}

function renderWeather(forecast) {
    const row = document.getElementById('weather-forecast-row');
    row.innerHTML = '';
    if (!forecast) return;

    forecast.forEach(item => {
        const el = document.createElement('div');
        el.className = 'weather-card';
        let emoji = '☀️';
        const cond = item.condition.toLowerCase();
        if (cond.includes('chuva') || cond.includes('rain')) emoji = '🌧️';
        else if (cond.includes('nublado') || cond.includes('cloud') || cond.includes('overcast')) emoji = '☁️';
        else if (cond.includes('vento') || cond.includes('wind')) emoji = '💨';
        else if (cond.includes('tempestade') || cond.includes('storm') || cond.includes('thunder')) emoji = '⛈️';
        else if (cond.includes('neblina') || cond.includes('fog') || cond.includes('mist')) emoji = '🌫️';
        else if (cond.includes('parcial') || cond.includes('partly')) emoji = '⛅';

        el.innerHTML = `
            <span class="weather-day">${escapeHtml(item.day)}</span>
            <span class="weather-icon-styled">${emoji}</span>
            <span class="weather-temp">${escapeHtml(item.temp)}</span>
            <span class="weather-cond">${escapeHtml(item.condition)}</span>
        `;
        row.appendChild(el);
    });
}

function renderSightseeing(spots) {
    const list = document.getElementById('sightseeing-list');
    list.innerHTML = '';
    if (!spots) return;

    spots.forEach(spot => {
        const el = document.createElement('div');
        el.className = 'sightsee-card';
        el.innerHTML = `
            <h4>${escapeHtml(spot.name)}</h4>
            <span class="sightsee-type">${escapeHtml(spot.type)}</span>
            <p>${escapeHtml(spot.description)}</p>
        `;
        el.addEventListener('click', () => {
            document.querySelectorAll('#sightseeing-list .sightsee-card').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('#events-list .event-item').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            showActivityDetails(spot, 'spot');
        });
        list.appendChild(el);
    });
}

function renderEvents(events) {
    const list = document.getElementById('events-list');
    list.innerHTML = '';
    if (!events || events.length === 0) {
        list.innerHTML = `<div class="suggestions-text">${t('agenda.noEvents')}</div>`;
        return;
    }
    events.forEach(evt => {
        const el = document.createElement('div');
        el.className = 'event-item';
        el.innerHTML = `
            <div class="event-item-header">
                <h4>${escapeHtml(evt.name)}</h4>
                <span class="event-date">${escapeHtml(evt.date)}</span>
            </div>
            <p>${escapeHtml(evt.description)}</p>
        `;
        el.addEventListener('click', () => {
            document.querySelectorAll('#sightseeing-list .sightsee-card').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('#events-list .event-item').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            showActivityDetails(evt, 'event');
        });
        list.appendChild(el);
    });
}

window.showActivityDetails = function(act, type) {
    if (!act) return;
    lastSelectedActivity = { act, type };

    const timelinePanel = document.getElementById('agenda-timeline-panel');
    const checklistPanel = document.getElementById('agenda-checklist-panel');
    const detailPanel = document.getElementById('agenda-detail-panel');
    const mapPanel = document.getElementById('agenda-map-panel');

    if (timelinePanel) timelinePanel.style.display = 'none';
    if (checklistPanel) checklistPanel.style.display = 'none';
    if (detailPanel) detailPanel.style.display = 'block';
    if (mapPanel) mapPanel.style.display = 'block';

    const nameEl = document.getElementById('agenda-item-name');
    if (nameEl) nameEl.innerText = act.name;
    const descEl = document.getElementById('agenda-item-description');
    if (descEl) descEl.innerText = act.description || '';

    const urlContainer = document.getElementById('agenda-item-url-container');
    const linkEl = document.getElementById('agenda-item-link');
    if (urlContainer && linkEl) {
        if (act.url) {
            linkEl.href = act.url;
            urlContainer.style.display = 'block';
        } else {
            urlContainer.style.display = 'none';
        }
    }

    const badgeEl = document.getElementById('agenda-item-badge');
    if (badgeEl) {
        badgeEl.innerHTML = type === 'spot'
            ? `<i data-lucide="compass" class="icon-small"></i> ${escapeHtml(act.type || t('misc.attraction'))}`
            : `<i data-lucide="calendar" class="icon-small"></i> ${t('misc.event')} - ${escapeHtml(act.date || '')}`;
    }

    const photoEl = document.getElementById('agenda-item-photo');
    if (photoEl) TripMedia.applyMediaAsset(photoEl, document.getElementById('agenda-item-photo-attribution'), act.media, `Imagem de ${act.name}`);

    const practicalEl = document.getElementById('agenda-item-practical');
    const practicalTitle = document.getElementById('agenda-practical-title');
    if (practicalEl) {
        practicalEl.innerHTML = '';
        if (type === 'spot') {
            if (practicalTitle) practicalTitle.innerText = t('agenda.practical');
            const costSpan = document.createElement('span');
            costSpan.className = 'dietary-tag';
            costSpan.style.cssText = 'border-color:rgba(16,185,129,0.2);color:var(--color-emerald);background:rgba(16,185,129,0.05);';
            costSpan.innerText = `${t('misc.cost')}: ${act.estimated_cost || t('misc.free')}`;
            practicalEl.appendChild(costSpan);
            const timeSpan = document.createElement('span');
            timeSpan.className = 'dietary-tag';
            timeSpan.innerText = `${t('misc.bestTime')}: ${act.best_time || t('misc.anyTime')}`;
            practicalEl.appendChild(timeSpan);
        } else {
            if (practicalTitle) practicalTitle.innerText = `${t('misc.venue')} & ${t('misc.date')}`;
            const venueSpan = document.createElement('span');
            venueSpan.className = 'dietary-tag';
            venueSpan.style.cssText = 'border-color:rgba(99,102,241,0.2);color:var(--color-indigo);background:rgba(99,102,241,0.05);';
            venueSpan.innerText = `${t('misc.venue')}: ${act.venue || 'N/A'}`;
            practicalEl.appendChild(venueSpan);
            const dateSpan = document.createElement('span');
            dateSpan.className = 'dietary-tag';
            dateSpan.innerText = `${t('misc.date')}: ${act.date || ''}`;
            practicalEl.appendChild(dateSpan);
        }
    }

    lucide.createIcons();

    if (agendaMapInstance) { agendaMapInstance = null; }

    const mapContainer = document.getElementById('agenda-map');
    if (!act.lat || !act.lng || isNaN(act.lat) || isNaN(act.lng)) {
        if (mapContainer) mapContainer.innerHTML = `<div class="suggestions-text" style="padding:40px 20px;text-align:center;">${t('misc.noGeoActivity')}</div>`;
        lucide.createIcons();
        return;
    }

    try {
        if (typeof google === 'undefined' || !google.maps) {
            if (mapContainer) mapContainer.innerHTML = `<div style="padding:20px;text-align:center;color:white;">Google Maps API não carregada.</div>`;
            return;
        }
        agendaMapInstance = new google.maps.Map(mapContainer, {
            center: { lat: parseFloat(act.lat), lng: parseFloat(act.lng) },
            zoom: 15,
            disableDefaultUI: true
        });
        const color = type === 'spot' ? '#06B6D4' : '#F59E0B';
        const marker = new google.maps.Marker({
            position: { lat: parseFloat(act.lat), lng: parseFloat(act.lng) },
            map: agendaMapInstance,
            title: act.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '#151D30',
                strokeWeight: 2
            }
        });
        const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${escapeHtml(act.name)}</strong><br><span style="font-size:11px;color:#94a3b8;">${escapeHtml(act.description || '')}</span>`
        });
        infoWindow.open(agendaMapInstance, marker);
        marker.addListener('click', () => infoWindow.open(agendaMapInstance, marker));
    } catch (e) { console.error("Failed to render agenda map:", e); }
};

window.showDefaultAgendaView = function() {
    const timelinePanel = document.getElementById('agenda-timeline-panel');
    const checklistPanel = document.getElementById('agenda-checklist-panel');
    const detailPanel = document.getElementById('agenda-detail-panel');
    const mapPanel = document.getElementById('agenda-map-panel');

    if (timelinePanel) timelinePanel.style.display = 'block';
    if (checklistPanel) checklistPanel.style.display = 'block';
    if (detailPanel) detailPanel.style.display = 'none';
    if (mapPanel) mapPanel.style.display = 'none';

    document.querySelectorAll('#sightseeing-list .sightsee-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('#events-list .event-item').forEach(c => c.classList.remove('active'));
    if (agendaMapInstance) { agendaMapInstance = null; }
};

function renderAgenda(agenda) {
    const container = document.getElementById('daily-agenda-timeline');
    container.innerHTML = '';
    if (!agenda) return;

    agenda.forEach(day => {
        const el = document.createElement('div');
        el.className = 'agenda-day';
        const actList = day.activities.map(act => `<li>${escapeHtml(act)}</li>`).join('');
        el.innerHTML = `
            <div class="agenda-day-dot"></div>
            <h4>${escapeHtml(day.day)}</h4>
            <ul class="agenda-activities-list">${actList}</ul>
        `;
        container.appendChild(el);
    });
}

function renderAgentTraces(logs, results) {
    const list = document.getElementById('agent-raw-logs-list');
    list.innerHTML = '';

    const subAgents = [
        { key: 'location', name: 'Location & Maps Agent (location_agent)', icon: 'map' },
        { key: 'weather', name: 'Weather & Clothing Agent (weather_agent)', icon: 'sunset' },
        { key: 'logistics', name: 'Logistics & Hotels Agent (logistics_agent)', icon: 'hotel' },
        { key: 'cuisine', name: 'Gastronomy & Recipe Agent (cuisine_agent)', icon: 'utensils' },
        { key: 'events', name: 'Events & Activities Agent (events_agent)', icon: 'calendar' }
    ];

    subAgents.forEach(agent => {
        if (results[agent.key]) {
            const el = document.createElement('div');
            el.className = 'trace-card';
            const stringified = JSON.stringify(results[agent.key], null, 4);
            const traceId = `trace-${agent.key}`;
            el.innerHTML = `
                <div class="trace-card-header" onclick="toggleTrace('${traceId}')">
                    <h4><i data-lucide="${agent.icon}"></i> ${agent.name}</h4>
                    <span class="trace-badge completed">Payload OK</span>
                </div>
                <div id="${traceId}" class="trace-card-body" style="display: none;">${escapeHtml(stringified)}</div>
            `;
            list.appendChild(el);
        }
    });
    lucide.createIcons();
}

function toggleTrace(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// =============================================================
// INTERACTIVE LEAFLET MAP
// =============================================================
function setupLeafletMap(center, nodes) {
    clearMap();
    const centerLat = center ? center.lat : -5.7944;
    const centerLng = center ? center.lng : -35.2110;

    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    if (typeof google === 'undefined' || !google.maps) {
        mapEl.innerHTML = `<div style="padding:20px;text-align:center;color:white;">Google Maps API não carregada. Verifique sua PLACES_API_KEY.</div>`;
        return;
    }

    mapInstance = new google.maps.Map(mapEl, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 8,
        disableDefaultUI: false
    });

    if (!nodes || nodes.length === 0) return;

    const coordinates = [];
    const infoWindow = new google.maps.InfoWindow();

    nodes.forEach((node, index) => {
        if (!node || node.lat == null || node.lng == null) return;
        const markerCoords = { lat: parseFloat(node.lat), lng: parseFloat(node.lng) };
        coordinates.push(markerCoords);

        let colorClass = 'cyan';
        if (index === 0) colorClass = 'emerald';
        else if (index === nodes.length - 1) colorClass = 'rose';

        const colorHex = colorClass === 'emerald' ? '#10B981' : colorClass === 'rose' ? '#EF4444' : '#06B6D4';

        const marker = new google.maps.Marker({
            position: markerCoords,
            map: mapInstance,
            title: node.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: colorHex,
                fillOpacity: 1,
                strokeColor: '#151D30',
                strokeWeight: 2
            }
        });

        marker.addListener('click', () => {
            infoWindow.setContent(`<strong>${escapeHtml(node.name)}</strong><br><span style="font-size:11px;color:#94a3b8;">${escapeHtml(node.description)}</span>`);
            infoWindow.open(mapInstance, marker);
        });

        mapMarkers.push(marker);
    });

    const snapBtn = document.getElementById('btn-snap-toggle');
    if (snapBtn) {
        snapBtn.className = 'btn-snap-inactive';
        snapBtn.innerHTML = `<i data-lucide="navigation"></i> ${t('map.straightLine')}`;
        lucide.createIcons();

        snapBtn.onclick = () => {
            const isSnapped = snapBtn.classList.contains('btn-snap-active');
            if (!isSnapped) {
                snapBtn.innerHTML = `<span class="spinner-small"></span> ${t('map.loading')}`;
                const osrmCoords = nodes.map(n => `${n.lng},${n.lat}`).join(';');
                fetch(`https://router.project-osrm.org/route/v1/driving/${osrmCoords}?overview=full&geometries=geojson`)
                    .then(r => r.json())
                    .then(data => {
                        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                            if (mapRouteLine) mapRouteLine.setMap(null);
                            const snappedCoords = data.routes[0].geometry.coordinates.map(c => ({ lat: c[1], lng: c[0] }));
                            
                            mapRouteLine = new google.maps.Polyline({
                                path: snappedCoords,
                                strokeColor: '#6366F1',
                                strokeOpacity: 0.8,
                                strokeWeight: 4,
                                map: mapInstance
                            });

                            const bounds = new google.maps.LatLngBounds();
                            snappedCoords.forEach(coord => bounds.extend(coord));
                            mapInstance.fitBounds(bounds);

                            snapBtn.className = 'btn-snap-active';
                            snapBtn.innerHTML = `<i data-lucide="check"></i> ${t('map.snapped')}`;
                            lucide.createIcons();
                        } else {
                            alert("Não foi possível carregar a rota pelas rodovias.");
                            snapBtn.className = 'btn-snap-inactive';
                            snapBtn.innerHTML = `<i data-lucide="navigation"></i> ${t('map.straightLine')}`;
                            lucide.createIcons();
                        }
                    })
                    .catch(err => {
                        console.error("OSRM routing failed:", err);
                        snapBtn.className = 'btn-snap-inactive';
                        snapBtn.innerHTML = `<i data-lucide="navigation"></i> ${t('map.straightLine')}`;
                        lucide.createIcons();
                    });
            } else {
                if (mapRouteLine) mapRouteLine.setMap(null);
                drawStraightRoute(coordinates);
                
                const bounds = new google.maps.LatLngBounds();
                coordinates.forEach(coord => bounds.extend(coord));
                mapInstance.fitBounds(bounds);

                snapBtn.className = 'btn-snap-inactive';
                snapBtn.innerHTML = `<i data-lucide="navigation"></i> ${t('map.straightLine')}`;
                lucide.createIcons();
            }
        };
    }

    if (coordinates.length > 1) {
        drawStraightRoute(coordinates);
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(coord => bounds.extend(coord));
        mapInstance.fitBounds(bounds);
    }
}

function drawStraightRoute(coordinates) {
    const lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 0.8,
        scale: 3,
        strokeColor: '#6366F1'
    };
    mapRouteLine = new google.maps.Polyline({
        path: coordinates,
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '15px'
        }],
        map: mapInstance
    });
}

function clearMap() {
    mapMarkers.forEach(m => m.setMap(null));
    mapMarkers = [];
    if (mapRouteLine) { mapRouteLine.setMap(null); mapRouteLine = null; }
    mapInstance = null;
}

// =============================================================
// UTILITIES
// =============================================================
function translateType(type) {
    switch (type) {
        case 'roadtrip': return t('misc.tripType.roadtrip');
        case 'business': return t('misc.tripType.business');
        case 'gastronomy': return t('misc.tripType.gastronomy');
        default: return t('misc.tripType.custom');
    }
}

function escapeHtml(str) {
    return TripMedia.escapeHtml(str);
}
