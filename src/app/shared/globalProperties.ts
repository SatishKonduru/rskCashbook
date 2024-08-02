export class globalProperties {
    public static genericError: string = 'Something Went Wrong! Please try again later'
    public static nameRegx : string = '([a-zA-Z0-9 ])'
    public static toastrConfig = {
        maxOpend: 0,
        preventDuplicates: true,
        closeButton: true,
        timeOut: 5000,
        easing : 'ease-in',
        progressBar: true,
        toastClass: 'ngx-toastr',
        positionClass: 'toast-top-right',
        titleClass: 'toast-title',
        messageClass: 'toast-message',
        topToDismiss: true
    }

}