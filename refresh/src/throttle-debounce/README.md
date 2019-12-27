## Usage

```javascript
import { throttle, debounce } from 'throttle-debounce';

throttle(300, () => {
  // Throttled function
});

debounce(300, () => {
  // Debounced function
});
```

### cancelling

```javascript
const throttled = throttle(300, () => {
  // Throttled function
});
throttled.cancel();
```
