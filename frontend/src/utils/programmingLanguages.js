export const PROGRAMMING_LANGUAGES = [
  { id: 'Java', label: 'Java', extension: 'java' },
  { id: 'Python', label: 'Python', extension: 'py' },
  { id: 'C', label: 'C', extension: 'c' },
  { id: 'C++', label: 'C++', extension: 'cpp' },
  { id: 'JavaScript', label: 'JavaScript', extension: 'js' },
  { id: 'C#', label: 'C#', extension: 'cs' },
];

export const DEFAULT_LANGUAGE = 'Java';

export function normalizeLanguage(language) {
  const raw = (language || DEFAULT_LANGUAGE).trim().toLowerCase();
  const match = PROGRAMMING_LANGUAGES.find(
    (item) => item.id.toLowerCase() === raw || item.label.toLowerCase() === raw
  );
  if (match) return match.id;
  if (raw === 'cpp' || raw === 'cxx') return 'C++';
  if (raw === 'csharp' || raw === 'cs') return 'C#';
  if (raw === 'js' || raw === 'node') return 'JavaScript';
  if (raw === 'py' || raw === 'python3') return 'Python';
  return DEFAULT_LANGUAGE;
}

export function getLanguageExtension(language) {
  const normalized = normalizeLanguage(language);
  return PROGRAMMING_LANGUAGES.find((item) => item.id === normalized)?.extension || 'txt';
}

function problemKey(question) {
  const title = (question?.title || '').toLowerCase();
  if (title.includes('sum') || title.includes('add')) return 'sum';
  if (title.includes('reverse')) return 'reverse';
  if (title.includes('factorial')) return 'factorial';
  if (title.includes('palindrome')) return 'palindrome';
  if (title.includes('max') || title.includes('largest')) return 'max';
  return 'default';
}

const STARTERS = {
  Java: {
    sum: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        int result = 0; // TODO: calculate the sum
        System.out.println(result);
    }
}
`,
    reverse: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        scanner.useDelimiter("\\\\A");
        String input = scanner.hasNext() ? scanner.next().trim() : "";
        String result = ""; // TODO: reverse input
        System.out.println(result);
    }
}
`,
    factorial: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        long result = 1; // TODO: calculate factorial
        System.out.println(result);
    }
}
`,
    palindrome: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        scanner.useDelimiter("\\\\A");
        String input = scanner.hasNext() ? scanner.next().trim() : "";
        boolean result = false; // TODO: check palindrome
        System.out.println(result);
    }
}
`,
    max: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int max = 0; // TODO: read numbers and find maximum
        System.out.println(max);
    }
}
`,
    default: `public class Solution {
    public static void main(String[] args) {
        // Read input from standard input and print the answer.
    }
}
`,
  },
  Python: {
    sum: `data = input().split()
a = int(data[0])
b = int(data[1])
result = 0  # TODO: calculate the sum
print(result)
`,
    reverse: `text = input().strip()
result = ""  # TODO: reverse text
print(result)
`,
    factorial: `n = int(input().strip())
result = 1  # TODO: calculate factorial
print(result)
`,
    palindrome: `text = input().strip().lower()
result = False  # TODO: check palindrome
print(str(result).lower())
`,
    max: `numbers = list(map(int, input().split()))
result = 0  # TODO: find maximum
print(result)
`,
    default: `# Read input from standard input and print the answer.
`,
  },
  C: {
    sum: `#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    int result = 0; // TODO: calculate the sum
    printf("%d\\n", result);
    return 0;
}
`,
    reverse: `#include <stdio.h>
#include <string.h>

int main(void) {
    char text[1000];
    fgets(text, sizeof(text), stdin);
    text[strcspn(text, "\\n")] = '\\0';
    // TODO: print text in reverse
    return 0;
}
`,
    factorial: `#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    long long result = 1; // TODO: calculate factorial
    printf("%lld\\n", result);
    return 0;
}
`,
    palindrome: `#include <stdio.h>

int main(void) {
    char text[1000];
    scanf("%999s", text);
    // TODO: print true or false
    return 0;
}
`,
    max: `#include <stdio.h>

int main(void) {
    int value;
    int result = 0; // TODO: find maximum from all input numbers
    while (scanf("%d", &value) == 1) {
    }
    printf("%d\\n", result);
    return 0;
}
`,
    default: `#include <stdio.h>

int main(void) {
    // Read input from standard input and print the answer.
    return 0;
}
`,
  },
  'C++': {
    sum: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    int result = 0; // TODO: calculate the sum
    cout << result << endl;
    return 0;
}
`,
    reverse: `#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

int main() {
    string text;
    getline(cin, text);
    string result = ""; // TODO: reverse text
    cout << result << endl;
    return 0;
}
`,
    factorial: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long result = 1; // TODO: calculate factorial
    cout << result << endl;
    return 0;
}
`,
    palindrome: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string text;
    cin >> text;
    bool result = false; // TODO: check palindrome
    cout << (result ? "true" : "false") << endl;
    return 0;
}
`,
    max: `#include <iostream>
using namespace std;

int main() {
    int value;
    int result = 0; // TODO: find maximum from all input numbers
    while (cin >> value) {
    }
    cout << result << endl;
    return 0;
}
`,
    default: `#include <iostream>
using namespace std;

int main() {
    // Read input from standard input and print the answer.
    return 0;
}
`,
  },
  JavaScript: {
    sum: `const input = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);
const a = input[0];
const b = input[1];
const result = 0; // TODO: calculate the sum
console.log(result);
`,
    reverse: `const text = require('fs').readFileSync(0, 'utf8').trim();
const result = ''; // TODO: reverse text
console.log(result);
`,
    factorial: `const n = Number(require('fs').readFileSync(0, 'utf8').trim());
let result = 1; // TODO: calculate factorial
console.log(result);
`,
    palindrome: `const text = require('fs').readFileSync(0, 'utf8').trim().toLowerCase();
const result = false; // TODO: check palindrome
console.log(result ? 'true' : 'false');
`,
    max: `const numbers = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);
const result = 0; // TODO: find maximum
console.log(result);
`,
    default: `// Read input from standard input and print the answer.
`,
  },
  'C#': {
    sum: `using System;

class Program {
    static void Main() {
        var parts = Console.ReadLine().Split(' ');
        int a = int.Parse(parts[0]);
        int b = int.Parse(parts[1]);
        int result = 0; // TODO: calculate the sum
        Console.WriteLine(result);
    }
}
`,
    reverse: `using System;

class Program {
    static void Main() {
        string text = Console.ReadLine() ?? "";
        string result = ""; // TODO: reverse text
        Console.WriteLine(result);
    }
}
`,
    factorial: `using System;

class Program {
    static void Main() {
        int n = int.Parse(Console.ReadLine() ?? "0");
        long result = 1; // TODO: calculate factorial
        Console.WriteLine(result);
    }
}
`,
    palindrome: `using System;

class Program {
    static void Main() {
        string text = (Console.ReadLine() ?? "").ToLower();
        bool result = false; // TODO: check palindrome
        Console.WriteLine(result.ToString().ToLower());
    }
}
`,
    max: `using System;
using System.Linq;

class Program {
    static void Main() {
        int[] numbers = Console.In.ReadToEnd().Split(' ', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToArray();
        int result = 0; // TODO: find maximum
        Console.WriteLine(result);
    }
}
`,
    default: `using System;

class Program {
    static void Main() {
        // Read input from standard input and print the answer.
    }
}
`,
  },
};

export function getStarterCode(question, language) {
  const normalized = normalizeLanguage(language);
  const key = problemKey(question);
  if (normalized === normalizeLanguage(question?.language) && question?.starterCode && normalized === 'Java') {
    return question.starterCode;
  }
  return STARTERS[normalized]?.[key] || STARTERS[normalized]?.default || STARTERS[DEFAULT_LANGUAGE].default;
}
