import swal from 'sweetalert2';

const toast = (swal as any).mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000
});

export function notifyOk(title: string = 'Ok') {
  toast({
    type: 'success',
    title: `<span class="notifyok-title">${title}</span>`
  });
}
export function notifyInfo(title: string = 'Info', text: string = '') {
  toast({
    type: 'info',
    title: `<span class="notifyinfo-title">${title}</span>`,
    text: text,
    position: 'top'
  });
}
export function notifyWarn(title: string = 'Warning', text: string = '') {
  toast({
    type: 'warning',
    title: `<span class="notifywarn-title">${title}</span>`,
    text: text
  });
}
export function swalError(
  title: string = 'Error',
  text: string = 'Ocurrió un error!'
) {
  swal({
    title: `<span class="swalerror-title">${title}</span>`,
    text: text,
    type: 'error',
    focusConfirm: false,
    confirmButtonColor: '#f44336'
  }).catch(swal.noop);
}

export function swalInfo(
  title: string = 'Info',
  text: string = 'Sin Contenido!'
) {
  swal({
    title: `<span class="cl-info fw-300">${title}</span>`,
    text: text,
    type: 'info',
    focusConfirm: false,
    confirmButtonColor: '#00bcd4'
  }).catch(swal.noop);
}
