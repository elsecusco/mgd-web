import Swal from 'sweetalert2';

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
});

export function notifyOk(title: string = 'Ok') {
  toast.fire({
    icon: 'success',
    title: `<span class="notifyok-title">${title}</span>`,
  });
}
export function notifyInfo(title: string = 'Info', text: string = '') {
  toast.fire({
    icon: 'info',
    title: `<span class="notifyinfo-title">${title}</span>`,
    text: text,
    position: 'top',
  });
}
export function notifyWarn(title: string = 'Warning', text: string = '') {
  toast.fire({
    icon: 'warning',
    title: `<span class="notifywarn-title">${title}</span>`,
    text: text,
  });
}
export function swalError(
  title: string = 'Error',
  text: string = 'Ocurrió un error!'
) {
  Swal.fire({
    title: `<span class="swalerror-title">${title}</span>`,
    text: text,
    icon: 'error',
    focusConfirm: false,
    confirmButtonColor: '#f44336',
  })//.catch(swal.noop);
}

export function swalInfo(
  title: string = 'Info',
  text: string = 'Sin Contenido!'
) {
  Swal.fire({
    title: `<span class="cl-info fw-300">${title}</span>`,
    text: text,
    icon: 'info',// type: 'info',
    focusConfirm: false,
    confirmButtonColor: '#00bcd4',
  });
}

