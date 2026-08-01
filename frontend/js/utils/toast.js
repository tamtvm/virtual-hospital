// ------- Notifications ------

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: 'mlvh-swal-popup',
    },
    didOpen: (toastEl) => {
        toastEl.addEventListener('mouseenter', Swal.stopTimer);
        toastEl.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

/**
 * Confirmation/error message in the corner of the screen
 * @param {string} message
 * @param {'success' | 'error'} variant
 */
export const showToast = (message, variant = 'success') => {
    Toast.fire({
        icon: variant === 'error' ? 'error' : 'success',
        title: message,
    });
};

/**
 * Confirmation dialog for a destructive/important action
 * @param {string} message
 * @param {string} confirmButtonText
 * @returns {Promise<boolean>}
 */
export const confirmAction = async (message, confirmButtonText = 'Yes, continue') => {
    const result = await Swal.fire({
        icon: 'warning',
        iconColor: 'var(--mlvh-blue-deep)',
        text: message,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        buttonsStyling: false,
        customClass: {
            popup: 'mlvh-swal-popup',
            actions: 'mlvh-swal-actions',
            confirmButton: 'btn btn-mlvh-danger',
            cancelButton: 'btn btn-primary',
        },
    });
    return result.isConfirmed;
};