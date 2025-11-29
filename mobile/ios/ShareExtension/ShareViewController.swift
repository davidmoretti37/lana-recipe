import UIKit
import Social
import MobileCoreServices
import UniformTypeIdentifiers

class ShareViewController: SLComposeServiceViewController {

    private var sharedText: String?
    private var sharedImages: [UIImage] = []
    private var sharedUrl: String?

    override func isContentValid() -> Bool {
        return true
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Get shared content
        if let extensionItems = extensionContext?.inputItems as? [NSExtensionItem] {
            for item in extensionItems {
                if let attachments = item.attachments {
                    for attachment in attachments {
                        handleAttachment(attachment)
                    }
                }
            }
        }
    }

    private func handleAttachment(_ attachment: NSItemProvider) {
        // Handle URL
        if attachment.hasItemConformingToTypeIdentifier(UTType.url.identifier) {
            attachment.loadItem(forTypeIdentifier: UTType.url.identifier) { [weak self] (item, error) in
                if let url = item as? URL {
                    self?.sharedUrl = url.absoluteString
                }
            }
        }

        // Handle text
        if attachment.hasItemConformingToTypeIdentifier(UTType.text.identifier) {
            attachment.loadItem(forTypeIdentifier: UTType.text.identifier) { [weak self] (item, error) in
                if let text = item as? String {
                    self?.sharedText = text
                }
            }
        }

        // Handle image
        if attachment.hasItemConformingToTypeIdentifier(UTType.image.identifier) {
            attachment.loadItem(forTypeIdentifier: UTType.image.identifier) { [weak self] (item, error) in
                if let image = item as? UIImage {
                    self?.sharedImages.append(image)
                } else if let imageUrl = item as? URL,
                          let data = try? Data(contentsOf: imageUrl),
                          let image = UIImage(data: data) {
                    self?.sharedImages.append(image)
                }
            }
        }
    }

    override func didSelectPost() {
        // Create the shared data
        var sharedData: [String: Any] = [:]

        if let url = sharedUrl {
            sharedData["url"] = url
        }

        if let text = sharedText {
            sharedData["text"] = text
        }

        if let content = contentText, !content.isEmpty {
            sharedData["caption"] = content
        }

        // Convert images to base64 for storage
        var imageStrings: [String] = []
        for image in sharedImages {
            if let imageData = image.jpegData(compressionQuality: 0.7) {
                imageStrings.append(imageData.base64EncodedString())
            }
        }
        if !imageStrings.isEmpty {
            sharedData["images"] = imageStrings
        }

        // Save to shared UserDefaults (App Group)
        if let userDefaults = UserDefaults(suiteName: "group.com.lanarecipe.app") {
            userDefaults.set(sharedData, forKey: "SharedRecipeData")
            userDefaults.synchronize()
        }

        // Open the main app with a deep link
        if let url = URL(string: "lanarecipe://add-shared") {
            openURL(url)
        }

        self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
    }

    @objc func openURL(_ url: URL) {
        var responder: UIResponder? = self
        while responder != nil {
            if let application = responder as? UIApplication {
                application.open(url, options: [:], completionHandler: nil)
                return
            }
            responder = responder?.next
        }
    }

    override func configurationItems() -> [Any]! {
        // Add configuration options if needed
        return []
    }
}
