import { makeAutoObservable } from "mobx";
import { message } from "antd";
import releasesStore from "./releasesStore";

class HotFixes {
    saving = false
    saveError = false

    constructor() {
        makeAutoObservable(this)
    }

    setSaving = (saving) => {
        this.saving = saving
    }
    setSaveError = (saveError) => {
        this.saveError = saveError
    }

    save = async (releaseId, releaseName, hotFixDescription, hotFixDate) => {
        try {
            this.setSaving(true)
            this.setSaveError(false)
            let response = await fetch(`${process.env.REACT_APP_API_ENDPIONT}/releases/${releaseId}/hotfixes`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dateFix: hotFixDate,
                    description: hotFixDescription
                })
            })

            if (!response.ok) {
                let message = (await response.json()).message
                throw new Error(message)
            }
            message.success(`Хотфикс релиза ${releaseName} сохранен`)
            releasesStore.fetchReleases()


        }
        catch (error) {
            this.setSaveError(true)
            message.error(`Ошбика сохранения хотфикса: ${error.message}`)
        }
        finally {
            this.setSaving(false)
        }
    }

}

export default new HotFixes();