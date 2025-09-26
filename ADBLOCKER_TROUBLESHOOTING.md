# Ad Blocker Troubleshooting Guide

## Issue: `ERR_BLOCKED_BY_CLIENT` Error

This error occurs when ad blockers or privacy extensions block Google Maps requests.

### Common Causes:
1. **Ad Blockers**: uBlock Origin, AdBlock Plus, AdGuard
2. **Privacy Extensions**: Privacy Badger, Ghostery, DuckDuckGo Privacy Essentials
3. **Browser Security Settings**: Enhanced tracking protection
4. **Corporate Firewalls**: Network-level blocking

### Solutions:

#### 1. Disable Ad Blocker for This Site
- Click on your ad blocker extension icon
- Add this site to the whitelist/allowlist
- Refresh the page

#### 2. Common Ad Blocker Settings:
- **uBlock Origin**: Click the power button → "Disable on this site"
- **AdBlock Plus**: Click the ABP icon → "Disable on this site"
- **AdGuard**: Click the shield icon → "Disable protection"

#### 3. Privacy Extensions:
- **Privacy Badger**: Click the badge icon → "Disable Privacy Badger for this site"
- **Ghostery**: Click the ghost icon → "Trust site"
- **DuckDuckGo**: Click the shield icon → "Disable protection"

#### 4. Browser Settings:
- **Chrome**: Settings → Privacy and security → Site settings → Add exception
- **Firefox**: Settings → Privacy & Security → Enhanced Tracking Protection → Exceptions
- **Safari**: Safari → Settings → Privacy → Manage Website Data

#### 5. Network-Level Blocking:
- Contact your network administrator
- Use a different network (mobile hotspot, etc.)
- Configure VPN if allowed

### Testing:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for blocked requests

### Alternative Solutions:
1. Use a different browser without extensions
2. Use incognito/private mode
3. Temporarily disable all extensions
4. Use a different device/network

### For Developers:
- Add error handling for blocked requests
- Provide fallback UI when maps fail to load
- Display helpful error messages to users
- Consider alternative mapping solutions if needed

## Prevention:
- Test with common ad blockers during development
- Provide clear instructions for users
- Consider using alternative mapping services
- Implement graceful degradation
