import { UserCredentials } from "@/api/types";
import { IBaseViewModel, UpdateView } from "../BaseViewModel";


export class AuthViewModel implements IBaseViewModel {

    private _updateView: Nullable<UpdateView> = null;
    
    private _userInfo: Nullable<UserCredentials> = null;
    
    constructor() {}
    
    
    notifyAboutChanges() {
        if( typeof this._updateView === 'function' ) {
            this._updateView()
        }
    }

    attachView(cb: UpdateView) {
        this._updateView = cb
    }

    detachView() {
        this._updateView = null
    }

}