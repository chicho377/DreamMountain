// js de la pagina de reservas
// valida los campos del formulario de reserva y muestra un resumen de la reserva
// y permite confirmar la reserva con un modal de SweetAlert2
document.addEventListener('DOMContentLoaded', function() {
    // Variables de estado
    let selectedDates = {
        checkin: null,
        checkout: null
    };
    
    // Mostrar/ocultar campos de tarjeta segun metodo de pago
    document.getElementById('metodoPago').addEventListener('change', function() {
        const tarjetaFields = document.getElementById('tarjetaFields');
        tarjetaFields.style.display = this.value === 'tarjeta' ? 'block' : 'none';
    });
    
    // Inicializar calendario con seleccion de rango
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        selectable: true,
        selectMirror: true,
        selectLongPressDelay: 100,
        select: function(info) {
            // Solo permitir selecciones futuras
            if (info.start < new Date()) {
                calendar.unselect();
                Swal.fire({
                    icon: 'error',
                    title: 'Fecha no válida',
                    text: 'No puedes seleccionar fechas pasadas',
                    confirmButtonColor: '#0d6efd'
                });
                return;
            }
            
            // Valida seleccion minima de 1 noche
            const diffTime = Math.abs(info.end - info.start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 1) {
                calendar.unselect();
                Swal.fire({
                    icon: 'error',
                    title: 'Estancia mínima',
                    text: 'Debes seleccionar al menos 1 noche',
                    confirmButtonColor: '#0d6efd'
                });
                return;
            }
            
            // Ajusta la fecha de checkout
            const endDate = new Date(info.end);
            endDate.setDate(endDate.getDate() - 1);
            
            // Guardar fechas seleccionadas
            selectedDates.checkin = info.start;
            selectedDates.checkout = endDate;
            
            // Actualiza inputs
            document.getElementById('checkin').value = formatDate(info.start);
            document.getElementById('checkout').value = formatDate(endDate);
            
            // Limpia selecciones anteriores
            calendar.getEvents().forEach(event => {
                if (event.title === 'Estancia seleccionada') {
                    event.remove();
                }
            });
            
            // Muestra rango seleccionado
            const displayEndDate = new Date(endDate);
            displayEndDate.setDate(displayEndDate.getDate() + 1);
            
            calendar.addEvent({
                title: 'Estancia seleccionada',
                start: info.start,
                end: displayEndDate,
                color: '#0d6efd',
                display: 'background',
                allDay: true
            });
            
            updateResumen();
        },
        dateClick: function(info) {
            selectedDates.checkin = info.date;
            selectedDates.checkout = new Date(info.date);
            
            document.getElementById('checkin').value = formatDate(info.date);
            document.getElementById('checkout').value = formatDate(info.date);
            
            // Limpia y muestra la seleccion
            calendar.getEvents().forEach(event => {
                if (event.title === 'Estancia seleccionada') {
                    event.remove();
                }
            });
            
            calendar.addEvent({
                title: 'Estancia seleccionada',
                start: info.date,
                end: new Date(info.date.getTime() + 86400000), // +1 día para visualización
                color: '#0d6efd',
                display: 'background',
                allDay: true
            });
            
            updateResumen();
        }
    });
    calendar.render();
    
    // Formatea fecha
    function formatDate(date) {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    document.getElementById('verificarDisponibilidad').addEventListener('click', function() {
        Swal.fire({
            icon: 'success',
            title: '¡Disponible!',
            text: 'La habitación está disponible para las fechas seleccionadas.',
            confirmButtonText: 'Aceptar'
        });
    });

    
    // Actualiza el resumen
    function updateResumen() {
        if (!selectedDates.checkin || !selectedDates.checkout) return;
        
        // Asegura el calculo correctamente los dias incluyendo el checkout
        const checkin = new Date(selectedDates.checkin);
        const checkout = new Date(selectedDates.checkout);
        checkin.setHours(0, 0, 0, 0);
        checkout.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(checkout - checkin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
        
        const habitacion = document.getElementById('habitacion');
        const precio = getPrecio(habitacion.value);
        
        let html = `
            <h5 class="mb-3">${habitacion.options[habitacion.selectedIndex].text}</h5>
            <p><i class="fas fa-calendar-day me-2"></i> ${diffDays} noches</p>
            <p><i class="fas fa-arrow-right me-2"></i> Check-in: ${formatDate(checkin)}</p>
            <p><i class="fas fa-arrow-left me-2"></i> Check-out: ${formatDate(checkout)}</p>
            <p><i class="fas fa-user-friends me-2"></i> ${document.getElementById('huespedes').value} huéspedes</p>
            <hr>
            <h5 class="text-success">Total: $${(precio * diffDays).toLocaleString('es-ES')}</h5>
        `;
        
        document.getElementById('resumenReserva').innerHTML = html;
        document.getElementById('confirmarReserva').disabled = false;
    }
    
    // Obtiene precio segun habitacion
    function getPrecio(tipo) {
        switch(tipo) {
            case 'estandar': return 120;
            case 'familiar': return 220;
            case 'presidencial': return 350;
            default: return 0;
        }
    }
    
    // Event listeners
    document.getElementById('habitacion').addEventListener('change', updateResumen);
    document.getElementById('huespedes').addEventListener('change', updateResumen);
    
    // Formulario de reserva
    document.getElementById('reservaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateResumen();
        
        // Desplaza al resumen
        document.getElementById('resumenReserva').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Confirmar reserva
    document.getElementById('confirmarReserva').addEventListener('click', function() {
        if (!selectedDates.checkin || !selectedDates.checkout) return;
        
        // Valida campos requeridos
        const requiredFields = ['habitacion','nombre', 'cedula', 'email', 'telefono', 'metodoPago'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value) {
                element.classList.add('is-invalid');
                isValid = false;
            } else {
                element.classList.remove('is-invalid');
            }
        }); 
        
        if (!document.getElementById('terminos').checked) {
            document.getElementById('terminos').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('terminos').classList.remove('is-invalid');
        }
        
        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Campos requeridos',
                text: 'Por favor complete todos los campos obligatorios',
                confirmButtonColor: '#0d6efd'
            });
            return;
        }
        
        const checkin = new Date(selectedDates.checkin);
        const checkout = new Date(selectedDates.checkout);
        checkin.setHours(0, 0, 0, 0);
        checkout.setHours(0, 0, 0, 0);
        
        const diffTime = Math.abs(checkout - checkin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        Swal.fire({
            title: '¿Confirmar reserva?',
            html: `
                <div class="text-start">
                    <p><strong>${document.getElementById('nombre').value}</strong></p>
                    <p><i class="fas fa-envelope me-2"></i> ${document.getElementById('email').value}</p>
                    <p><i class="fas fa-id-card me-2"></i> ${document.getElementById('cedula').value}</p>
                    <hr>
                    <p><strong>${document.getElementById('habitacion').options[document.getElementById('habitacion').selectedIndex].text}</strong></p>
                    <p><i class="fas fa-calendar-day me-2"></i> ${diffDays} noches</p>
                    <p><i class="fas fa-arrow-right me-2"></i> Check-in: ${formatDate(checkin)}</p>
                    <p><i class="fas fa-arrow-left me-2"></i> Check-out: ${formatDate(checkout)}</p>
                    <p><i class="fas fa-user-friends me-2"></i> ${document.getElementById('huespedes').value} huéspedes</p>
                    <p><i class="fas fa-credit-card me-2"></i> ${document.getElementById('metodoPago').options[document.getElementById('metodoPago').selectedIndex].text}</p>
                    <hr>
                    <h5 class="text-success">Total: $${(getPrecio(document.getElementById('habitacion').value) * diffDays).toLocaleString('es-ES')}</h5>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar Pago',
            cancelButtonText: 'Modificar',
            customClass: {
                confirmButton: 'btn btn-success me-2',
                cancelButton: 'btn btn-outline-secondary'
            },
            buttonsStyling: false,
            backdrop: `
                rgba(0,0,0,0.4)
                url("https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif")
                center top
                no-repeat
            `
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '¡Reserva Confirmada!',
                    html: `
                        <div class="text-center">
                            <i class="fas fa-check-circle fa-4x text-success mb-3"></i>
                            <p>Hemos enviado los detalles de tu reserva a <strong>${document.getElementById('email').value}</strong></p>
                            <p class="fw-bold">Código de reserva: #${Math.floor(1000 + Math.random() * 9000)}</p>
                            <hr>
                            <p><small class="text-muted">Puedes gestionar tu reserva en el área de clientes</small></p>
                        </div>
                    `,
                    confirmButtonText: 'Aceptar',
                    willClose: () => {
                        // Resetea el formulario despues de confirmar
                        document.getElementById('reservaForm').reset();
                        calendar.getEvents().forEach(event => event.remove());
                        document.getElementById('resumenReserva').innerHTML = `
                            <i class="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
                            <p class="text-muted">Seleccione fechas para ver detalles</p>
                        `;
                        document.getElementById('tarjetaFields').style.display = 'none';
                        selectedDates = { checkin: null, checkout: null };
                    }
                });
            }
        });
    });
});