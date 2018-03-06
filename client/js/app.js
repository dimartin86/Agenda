


class EventsManager {
    constructor() {
        this.obtenerDataInicial()
    }

    obtenerDataInicial() {
        let url = '../server/getEvents.php'
        $.ajax({
            url: url,
            dataType: "json",
            cache: false,
            type: 'GET',
            data: {
                "idusuario": $('#idusuario').val()
            },
            success: (data) => {
                if (data.msg == "OK") {
                    this.poblarCalendario(data.eventos)
                } else {
                    alert(data.msg)
                    window.location.href = 'index.html';
                }
            },
            error: function () {
                alert("error en la comunicación con el servidor");
            }
        })

    }

    poblarCalendario(eventos) {

        $('.calendario').fullCalendar({
            heacalendarioder: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,listWeek'
            },
            defaultDate: '2018-03-01',
            navLinks: true, // can click day/week names to navigate views
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events: eventos,
            eventDragStart: (event, jsEvent) => {
                $('.delete-btn').find('img').attr('src', "img/trash-open.png");
                $('.delete-btn').css('background-color', '#a70f19')
            },
            eventDragStop: (event, jsEvent) => {
                var trashEl = $('.delete-btn');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 &&
                        jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                    this.eliminarEvento(event, jsEvent)
                    $('.calendario').fullCalendar('removeEvents', event.id);
                }

            },
            eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc) {

                var html1 = '<table id="tbl_editar_evento" class="table table-condensed">';
                    html1 += '<tr>';
                        html1 += '<td style="text-align:center"><label>Todo el día:</label><br><input type="checkbox" id="todo_el_dia"></td>';                       
                        html1 += '<td><label>Fecha Fin:</label><br><input type="text" id="fecha_fin"></td>';
                    html1 += '</tr>';
                        html1 += '<tr>';
                            html1 += '<td><label>Hora Inicia:</label><br><select id="hora_inicial"></select></td>';
                            html1 += '<td><label>Hora Fin:</label><br><select id="hora_fin"></select></td>';
                        html1 += '</tr>';                
                    html1 += '</table>';

                bootbox.dialog({
                    title: 'Editar evento',
                    message: html1,
                    buttons: {                      
                        salir: {                            
                            callback: function () {
                                bootbox.hideAll();
                            }
                        },
                        guardar: {
                            className: 'btn-info',
                            callback: function () {
                                $.ajax({
                                    url: '../server/update_event.php',
                                    dataType: "json",
                                    cache: false,
                                    data: {
                                        id : event.id,
                                        fecha_ini : event.start.format(),
                                        fecha_fin : $('#fecha_fin').val(),
                                        todo_dia : $('#todo_el_dia').is(':checked') ? 1 : 0,
                                        hora_ini : $('#hora_inicial').val(),
                                        hora_fin : $('#hora_fin').val(),
                                    },
                                    type: 'POST',
                                    success: (data) => {
                                        if (data.msg == "OK") {
                                            alert('Se ha actualizado el evento exitosamente')
                                        } else {
                                            alert(data.msg)
                                        }
                                    },
                                    error: function () {
                                        alert("error en la comunicación con el servidor");
                                    }
                                })
                            }                            
                        }
                    }
                });
                
                $('#tbl_editar_evento label').css({'color':'#333', 'font-weight':'bold'});    
                $('#fecha_fin').datepicker({
                    minDate: event.start.format(),
                    dateFormat: "yy-mm-dd"
                });
                
                var horas = '<option value="7:00" selected>7:00</option>';
                
                for (var i = 5; i <= 23; i++) {
                    horas += '<option value="'+i+':'+'00">'+i+':'+'00</option>' ;
                    horas += '<option value="'+i+':'+'30">'+i+':'+'30</option>' ;
                }
                
                $('#hora_inicial, #hora_fin').html(horas);
                
                $('#todo_el_dia').on('change', function () {
                    if (this.checked) {
                        $('#hora_inicial, #hora_fin, #fecha_fin').attr("disabled", "disabled")
                    } else {
                        $('#hora_inicial, #hora_fin, #fecha_fin').removeAttr("disabled")
                    }
                })    
            
                $('.ui-timepicker-viewport').css('position','absolute');
                
            }
        })
    }

    anadirEvento() {
        var arr_val = [];

        if ($('#titulo').val() == '') {
            arr_val.push('- Titulo');
        }

        if ($('#start_date').val() == '') {
            arr_val.push('- Fecha Inicio');
        }

        if ($('#end_date').val() == '' && $('#allDay').prop('checked') == false) {
            arr_val.push('- Fecha Fín');
        }

        if (arr_val.length > 0) {
            var cadena_val = "Los campos: <br>" + arr_val.join("<br>") + "<br>Son obligatoríos";

            $("#mensaje").html(cadena_val).dialog({
                modal: true,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });

        } else {
            var form_data = new FormData();
            form_data.append('idusuario', $('#idusuario').val())
            form_data.append('titulo', $('#titulo').val())
            form_data.append('start_date', $('#start_date').val())
            form_data.append('allDay', $('#allDay').is(':checked') ? 1 : 0)
            if (!document.getElementById('allDay').checked) {
                form_data.append('end_date', $('#end_date').val())
                form_data.append('end_hour', $('#end_hour').val())
                form_data.append('start_hour', $('#start_hour').val())
            } else {
                form_data.append('end_date', "")
                form_data.append('end_hour', "")
                form_data.append('start_hour', "")
            }
            $.ajax({
                url: '../server/new_event.php',
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                data: form_data,
                type: 'POST',
                success: (data) => {
                    if (data.msg == "OK") {
                        alert('Se ha añadido el evento exitosamente')
                        if ($('#allDay').is(':checked')) {
                            $('.calendario').fullCalendar('renderEvent', {
                                title: $('#titulo').val(),
                                start: $('#start_date').val(),
                                allDay: 1
                            })
                        } else {
                            $('.calendario').fullCalendar('renderEvent', {
                                title: $('#titulo').val(),
                                start: $('#start_date').val() + " " + $('#start_hour').val(),
                                allDay: 0,
                                end: $('#end_date').val() + " " + $('#end_hour').val()
                            })
                        }
                    } else {
                        alert(data.msg)
                    }
                },
                error: function () {
                    alert("error en la comunicación con el servidor");
                }
            })
        }

    }

    eliminarEvento(event, jsEvent) {
        var form_data = new FormData()
        form_data.append('id', event.id)
        $.ajax({
            url: '../server/delete_event.php',
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            data: form_data,
            type: 'POST',
            success: (data) => {
                if (data.msg == "OK") {
                    alert('Se ha eliminado el evento exitosamente')
                } else {
                    alert(data.msg)
                }
            },
            error: function () {
                alert("error en la comunicación con el servidor");
            }
        })
        $('.delete-btn').find('img').attr('src', "img/trash.png");
        $('.delete-btn').css('background-color', '#8B0913')
    }

}


$(function () {
    initForm();
    var e = new EventsManager();
    $('form').submit(function (event) {
        event.preventDefault()
        e.anadirEvento()
    })
});



function initForm() {
    $('#start_date, #titulo, #end_date').val('');
    $('#start_date, #end_date').datepicker({
        dateFormat: "yy-mm-dd"
    });
    $('.timepicker').timepicker({
        timeFormat: 'HH:mm',
        interval: 30,
        minTime: '5',
        maxTime: '23:30',
        defaultTime: '7',
        startTime: '5:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });
    $('#allDay').on('change', function () {
        if (this.checked) {
            $('.timepicker, #end_date').attr("disabled", "disabled")
        } else {
            $('.timepicker, #end_date').removeAttr("disabled")
        }
    })

}
