/* eslint-disable linebreak-style */
'use strict';
var globalPayService = require('*/cartridge/scripts/services/globalPayService');
/**
 *  Returns access token upon invoking this function
 * @returns {accessToken} - access token in form of string
 */
function getAccessToken() {
    var CacheMgr = require('dw/system/CacheMgr');
    var Site = require('dw/system/Site');

    var globalPayPreferences = require('*/cartridge/scripts/helpers/globalPayPreferences');
    var tokenCache = CacheMgr.getCache('GlobalPayAccessToken');
    var accessToken = tokenCache.get('accessToken:' + Site.getCurrent().ID, function () {
        var preferences = globalPayPreferences.getPreferences();
        var AccessToken = require('*/cartridge/scripts/dto/accessToken');

        var accessTokenRequest = new AccessToken.Request();

        accessTokenRequest.setGrantType(preferences.grantType);
        accessTokenRequest.setAppId(preferences.appId);
        accessTokenRequest.setAppKey(preferences.appKey);
        accessTokenRequest.setNonce(Date.now().toString());

        var result = globalPayService.executeRequest(accessTokenRequest, AccessToken.Response);

        if (result.success) {
            return result.response.getToken();
        }
    });

    return accessToken || null;
}
 
module.exports = {
    getAccessToken: getAccessToken
};
