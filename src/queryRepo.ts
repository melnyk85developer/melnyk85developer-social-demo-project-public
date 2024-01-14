const videoQueryRepo = {
    getVideos(): VideoOutputModel[] {
        const dbVideos: DBVideo[] = []
        const authors: DBAuthor[] = []

        return dbVideos.map(dbVideos => {
            const author = authors.find(a => a._id === dbVideos.authorId)
            return this._mapDBVideoToVideoOutputModel(dbVideos, author!)
        })
    },
    getVideoById(id: string): VideoOutputModel {
        const dbVideo: DBVideo = {
            _id: '6855',
            title: 'kjbjb',
            authorId: '7676'
        }
        const author: DBAuthor = {
            _id: '96706',
            lastName: 'kbh',
            firstName: 'kgblg'

        }
        return this._mapDBVideoToVideoOutputModel(dbVideo, author)
    },
    _mapDBVideoToVideoOutputModel(dbVideo: DBVideo, dbAuthor: DBAuthor) {
        return {
            id: dbVideo._id,
            title: dbVideo.title,
            author: {
                id: dbAuthor!._id,
                name: dbAuthor!.firstName + ' ' + dbAuthor!.lastName
            }
        }
    }
} 
export type DBVideo = {
    _id: string
    title: string
    authorId: string
}
export type DBAuthor = {
    _id: string
    firstName: string
    lastName: string
}
export type VideoOutputModel = {
    id: string
    title: string
    author: {
        id: string
        name: string
    }
}
export type BannedVideoOutputModel = {
    id: string
    title: string
    author: {
        id: string
        name: string
    },
    banReason: string
}