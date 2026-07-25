// ------- Notifications ------

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    // Pauses on hover
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
        text: message,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
        reverseButtons: true,
    });
    return result.isConfirmed;
};