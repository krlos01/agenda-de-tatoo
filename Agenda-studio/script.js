// Seleção dos elementos do DOM
const appointmentForm = document.getElementById('appointment-form');
const appointmentsList = document.getElementById('appointments-list');
const totalSessionsEl = document.getElementById('total-sessions');

// Carrega os agendamentos salvos no localStorage ou inicia um array vazio
let appointments = JSON.parse(localStorage.getItem('tattoo_appointments')) || [];

// Função para formatar a data de YYYY-MM-DD para DD/MM/YYYY
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Salva e atualiza a tela
function updateApp() {
    // Ordena os agendamentos por data e horário cronologicamente
    appointments.sort((a, b) => {
        return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
    });

    localStorage.setItem('tattoo_appointments', JSON.stringify(appointments));
    renderAppointments();
}

// Função para renderizar os cards de agendamento na tela
function renderAppointments() {
    appointmentsList.innerHTML = '';
    totalSessionsEl.textContent = appointments.length;

    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p style="color: #87868b; text-align: center;">Nenhuma sessão agendada para os próximos dias.</p>';
        return;
    }

    appointments.forEach((appointment) => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        
        card.innerHTML = `
            <h3>${appointment.client}</h3>
            <p><strong>Tatuador:</strong> ${appointment.artist}</p>
            <p><strong>Design:</strong> ${appointment.style}</p>
            <span class="time-tag">📅 ${formatDate(appointment.date)} às ${appointment.time}</span>
            <button class="btn-delete" onclick="deleteAppointment('${appointment.id}')" title="Cancelar Sessão">❌</button>
        `;
        
        appointmentsList.appendChild(card);
    });
}

// Evento de envio do formulário (Criar Agendamento)
appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Captura os dados do formulário
    const client = document.getElementById('client').value;
    const artist = document.getElementById('artist').value;
    const style = document.getElementById('style').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Cria o objeto do novo agendamento com um ID único baseado no timestamp
    const newAppointment = {
        id: Date.now().toString(),
        client,
        artist,
        style,
        date,
        time
    };

    // Adiciona ao array principal e atualiza o sistema
    appointments.push(newAppointment);
    updateApp();

    // Limpa o formulário após salvar
    appointmentForm.reset();
});

// Função para deletar um agendamento
window.deleteAppointment = function(id) {
    if (confirm('Tem certeza de que deseja cancelar este agendamento?')) {
        appointments = appointments.filter(appointment => appointment.id !== id);
        updateApp();
    }
};

// Execução inicial ao carregar a página
renderAppointments();
