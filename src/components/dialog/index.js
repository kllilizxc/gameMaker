import styles from './styles.css'

const Dialog = {
    name: 'dialog',
    functional: true,
    render(h, { props, listeners, children }) {
        return <div class={styles.dialog} key={props.mKey}>
                <div class={styles.backdrop} onClick={listeners.close}/>
                <div class={styles.content}>{children}</div>
            </div>
    }
}

export const DialogService = {
    outletInstance: null,
    show(dialog) {
        return new Promise(resolve => {
            dialog.__resolve__ = resolve
            this.outletInstance.dialogs.push(dialog)
        })
    }
}

export const DialogOutlet = {
    name: 'dialog-outlet',
    created() {
        if (DialogService.outletInstance)
            throw new Error('<DialogOutlet> is a singleton and should have only one instance.')
        DialogService.outletInstance = this
    },
    beforeDestory() {
        DialogService.outletInstance = null
    },
    data: () => ({ dialogs: [] }),
    methods: {
        close(dialog, confirm) {
            this.dialogs.splice(this.dialogs.findIndex(d => d === dialog), 1)
            dialog.__resolve__(confirm)
        }
    },
    render(h) {
        return <div class={styles.dialogOutlet}>
            <transition-group name="bounce" tag="div">
            {this.dialogs.map((dialog, index) =>
                <Dialog mKey={index} onClose={() => this.close(dialog, false)}>
                    {dialog.contentSlot(h, confirm => this.close(dialog, confirm))}
                </Dialog>)}
            </transition-group>
        </div>
    }
}
