import { makeAutoObservable } from "mobx";
import { message } from "antd";


class Releases {
    pageNumber = 0
    pageSize = 10
    totalPages = 0
    content = []

    error = false
    loading = false
    saving = false
    saveError = false


    constructor() {
        makeAutoObservable(this, {}, { deep: true })
    }

    setPageNumber(pageNumber) {
        this.pageNumber = pageNumber
    }
    setPageSize(pageSize) {
        this.pageSize = pageSize
    }
    setTotalPages(totalPages) {
        this.totalPages = totalPages
    }
    setContent(content) {
        this.content = content
    }
    setError(error) {
        this.error = error
    }
    setLoading(loading) {
        this.loading = loading
    }
    setSaving(saving) {
        this.saving = saving
    }
    setSaveError(saveError) {
        this.saveError = saveError
    }



    async fetchReleases() {
        try {
            this.setLoading(true)
            this.setError(false)
            let response = await fetch(`${process.env.REACT_APP_API_ENDPIONT}/releases?is_include_hotfixes=true&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`)
            if (!response.ok) {
                let message = (await response.json()).message
                throw new Error(message)
            }

            let json = await response.json()

            this.setPageNumber(json.pageNumber)
            this.setPageSize(json.pageSize)
            this.setTotalPages(json.totalPages)
            this.setContent(json.content)
        }
        catch (e) {
            this.setError(true)
            message.error(`Ошбика получения списка релизов: ${e}`)

        }
        finally {
            this.setLoading(false)
        }
    }


    getPage(page, size) {
        this.setPageNumber(page)
        this.setPageSize(size)
        this.fetchReleases()
    }

    async save(releaseName, releaseStart, releaseEnd, codeFreeze, releaseDescription) {
        try {
            this.setSaving(true)
            this.setSaveError(false)
            let response = await fetch(`${process.env.REACT_APP_API_ENDPIONT}/releases`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: releaseName,
                    dateStart: releaseStart,
                    dateEnd: releaseEnd,
                    dateFreeze: codeFreeze,
                    description: releaseDescription
                })
            })

            if (!response.ok) {
                let message = (await response.json()).message
                throw new Error(message)
            }
            message.success(`Релиз ${releaseName} сохранен`)
            this.fetchReleases()
        }
        catch (error) {
            this.setSaveError(true)
            message.error(`Ошбика сохранения релиза: ${error.message}`)
            return false
        }
        finally {
            this.setSaving(false)

        }
    }

}

export default new Releases();