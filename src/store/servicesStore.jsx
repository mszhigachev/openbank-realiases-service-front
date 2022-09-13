import { makeAutoObservable } from "mobx";
import { message } from "antd";



class Service {
    id = null
    name = null;
    description = null
    microservice = false

    updating = false
    updateError = false

    versions = null
    loadingVersions = false
    loadingVersionsError = false
    savingVersion = false
    saveVersionError = false

    versionsPageNumber = 0
    versionsPageSize = 10
    versionsTotalPages = 0

    constructor(id, name, description, microservice) {
        this.id = id
        this.name = name
        this.description = description
        this.microservice = microservice
        makeAutoObservable(this, {}, { deep: true })
    }


    setDescription(description) {
        this.description = description
    }

    setMicroservice(microservice) {
        this.microservice = microservice
    }

    setUpdating(updating) {
        this.updating = updating
    }

    setUpdatingError(updateError) {
        this.updateError = updateError
    }

    setVersionsPageNumber(versionsPageNumber) {
        this.versionsPageNumber = versionsPageNumber
    }

    setVersionsPageSize(versionsPageSize) {
        this.versionsPageSize = versionsPageSize
    }

    setVersionsTotalPages(versionsTotalPages) {
        this.versionsTotalPages = versionsTotalPages
    }

    setSavingVersion(savingVersion) {
        this.savingVersion = savingVersion
    }

    setSaveVersionError(saveVersionError) {
        this.saveVersionError = saveVersionError
    }

    setVersions(versions) {
        this.versions = versions.content
        this.setVersionsPageNumber(versions.pageNumber)
        this.setVersionsPageSize(versions.pageSize)
        this.setVersionsTotalPages(versions.totalPages)
    }

    setLoadingVersions(loadingVersions) {
        this.loadingVersions = loadingVersions
    }

    setLoadingVersionsError(loadingVersionsError) {
        this.loadingVersionsError = loadingVersionsError
    }

    getVersionPage(pageNumber, pageSize) {
        this.setVersionsPageNumber(pageNumber)
        this.setVersionsPageSize(pageSize)
        this.fetchVersions()
    }
    async fetchVersions() {
        try {
            this.setLoadingVersions(true)
            this.setLoadingVersionsError(false)
            let response = await fetch(`${process.env.REACT_APP_API_ENDPIONT}/services/${this.id}/versions?pageNumber=${this.versionsPageNumber}&pageSize=${this.versionsPageSize}`)
            if (!response.ok) {
                let message = (await response.json()).message
                throw new Error(message)
            }

            let json = await response.json()

            this.setVersions(json)
        }
        catch (e) {
            this.setLoadingVersionsError(true)
            message.error(`Ошбика получения списка версий ${e}`)

        }
        finally {
            this.setLoadingVersions(false)
        }
    }

    async SaveVersion(version, comment) {
        try {
            this.setSavingVersion(true)
            this.setSaveVersionError(false)
            let response = await fetch(`${process.env.REACT_APP_API_ENDPIONT}/services/versions`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.name,
                    comment: comment,
                    version: version
                })
            })

            if (!response.ok) {
                let message = (await response.json()).message
                throw new Error(message)
            }
            message.success(`Версия сервиса ${this.name} сохранена`)
            this.fetchVersions()
        }
        catch (error) {
            this.setSaveVersionError(true)
            message.error(`Ошбика сохранения версии ${error.message}`)
            return false
        }
        finally {
            this.setSavingVersion(false)

        }
    }

    async update(serviceDescription, isMicroservice) {
        try {
            this.setUpdating(true)
            this.setUpdatingError(false)
            let response = await fetch(`${process.env.REACT_APP_API_ENDPIONT}/services/${this.id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: serviceDescription,
                    microservice: isMicroservice
                })
            })

            if (!response.ok) {
                let message = (await response.json()).message
                throw new Error(message)
            }
            let json = await response.json()

            this.setDescription(json.description)
            this.setMicroservice(json.microservice)

            message.success(`Сервис ${this.name} обновлен`)
        }
        catch (error) {
            this.setUpdatingError(true)
            message.error(`Ошбика обновления сервиса: ${error.message}`)
            return false
        }
        finally {
            this.setUpdating(false)

        }
    }
}

class Services {
    content = []
    loading = false
    error = false
    saving = false
    saveError = false


    constructor() {
        makeAutoObservable(this, {}, { deep: true })
    }

    setContent(content) {
        this.content = content.map((service) => { return new Service(service.id, service.name, service.description, service.microservice) })
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

    async fetchServices() {
        try {
            this.setLoading(true)
            this.setError(false)
            let response = await fetch(`${process.env.REACT_APP_API_ENDPIONT}/services`)
            if (!response.ok) {
                let message = (await response.json()).message
                throw new Error(message)
            }

            let json = await response.json()

            this.setContent(json)
        }
        catch (e) {
            this.setError(true)
            message.error(`Ошбика получения списка сервисов: ${e}`)

        }
        finally {
            this.setLoading(false)
        }
    }

    async save(serviceName, serviceDescription, isMicroservice) {
        try {
            this.setSaving(true)
            this.setSaveError(false)
            let response = await fetch(`${process.env.REACT_APP_API_ENDPIONT}/services`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: serviceName,
                    description: serviceDescription,
                    microservice: isMicroservice
                })
            })

            if (!response.ok) {
                let message = (await response.json()).message
                throw new Error(message)
            }
            message.success(`Сервис ${serviceName} сохранен`)
            this.fetchServices()
        }
        catch (error) {
            this.setSaveError(true)
            message.error(`Ошбика сохранения сервиса: ${error.message}`)
            return false
        }
        finally {
            this.setSaving(false)

        }
    }

}

export default new Services();